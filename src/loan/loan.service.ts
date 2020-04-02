import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './loan.entity';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  findAll(): Promise<any[]> {
    return this.loanRepository.find();
  }

  findOne(id): Promise<Loan> {
    return this.loanRepository.findOne({ id });
  }

  create(payload): Promise<any> {
    return this.loanRepository.insert(payload);
  }

  delete(id) {
    return this.loanRepository.delete({ id });
  }

  async getPlan(id) {
    const loan = await this.findOne(id);
    const plan = [];
    const m = 12;
    const r = loan.percent / 100;
    let kwotaPozostala = loan.value;

    if (loan.type === 'const') {
      return this.obliczRateStala(loan.percent, loan.length, loan.value);
    } else {
      const czescKapitalowa = loan.value / loan.length;
      for (let i = 1; i < loan.length; i++) {
        const czescOdestkowa = (kwotaPozostala - czescKapitalowa) * (r / m);
        const rata = czescKapitalowa + czescOdestkowa;
        kwotaPozostala = kwotaPozostala - czescKapitalowa;
        plan.push({ id: i, rata, kwotaPozostala });
      }
    }
    return plan;
  }

  /*
    P - roczna stopa procentowa w postaci dziesiętnej, np 0.06 (czyli 6%)
    R - liczba miesięcznych rat
    W - wartość kredytu, np. 280000
 */

  obliczRateStala(percent, R, W) {
    /*
      P1 - znormalizowana wartość procentowa
      Jeżeli stopa procentowa jest równa 0.06, postać znormalizowana wynosi 1.06
      Licząc odsetki mnożmymy znormalizowaną wartość przez wartość początkową

      PN - znormalizowana wartość do potęgi N, N - liczba miesięcy

      PM - miesięczne odsetki, wyliczane ze stopy rocznej jako pierwiastek dwunastego stopnia

      PS - Suma ciągu PM+PM^2+...+PM^(N-1)+PM^N

      RT - miesięczna rata annuitetowa z dokładnością do dwóch miejsc po przecinku owiększona o odsetki z pierwszego miesiąca,
      bo zanim zapłacimy pierwszą ratę, bank już zdąży naliczyć co trzeba
   */
    const plan = [];
    const P = percent / 100;
    const P1 = P + 1;
    const PM = Math.pow(P1, 1 / 12);
    let PN = 1.0;
    let PS = 0.0;
    for (let i = 0; i < R; i++) {
      PN *= PM;
      PS += PN;
    }

    let RT = Math.round((100 * PM * W * PN) / PS) / 100.0;

    let sumaRat = 0.0;
    let doSplaty = Math.round(100 * W) / 100.0;
    for (let i = 0; i < R; i++) {
      doSplaty = Math.round(100 * doSplaty * PM) / 100.0;
      if (i === R - 1) {
        RT = doSplaty;
      }
      sumaRat += RT;
      const odsetki = Math.round((100 * doSplaty * (PM - 1)) / PM) / 100.0;
      doSplaty = doSplaty - RT;
      plan.push({
        month: i + 1,
        rata: RT.toFixed(2),
        doSplaty: doSplaty.toFixed(2),
        czescKapitalowa: (RT - odsetki).toFixed(2),
        czescOdsetkowa: odsetki.toFixed(2),
      });
    }
    return plan;
  }
}
