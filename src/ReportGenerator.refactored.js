export class ReportGenerator {
  static SMALL_VALUE = 500;
  static HIGH_VALUE = 1000;

  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    const isAdmin = user.role === 'ADMIN';
    const isCSV = reportType === 'CSV';

    const header = this.generateHeader(user.name, isCSV);
    const { body, total } = this.generateBody(items, isCSV, isAdmin, user.name);
    const footer = this.generateFooter(total, isCSV);

    return `${header}${body}${footer}`.trim();
  }

  generateHeader(name, isCSV) {
    if (isCSV) {
      return 'ID,NOME,VALOR,USUARIO\n';
    }

    let report = '';

    report += '<html><body>\n';
    report += '<h1>Relatório</h1>\n';
    report += `<h2>Usuário: ${name}</h2>\n`;
    report += '<table>\n';
    report += '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n';

    return report;
  }

  generateBody(items, isCSV, isAdmin, name) {
    let body = '';
    let total = 0;

    for (const item of items) {
      const isSmallValue = item.value <= ReportGenerator.SMALL_VALUE;
      const isHighValue = item.value > ReportGenerator.HIGH_VALUE;
      const isPriority = isHighValue && !isCSV && isAdmin;
      const style = isPriority ? ' style="font-weight:bold;"' : '';

      if (!isSmallValue && !isAdmin) {
        continue;
      }

      if (isCSV) {
        body += `${item.id},${item.name},${item.value},${name}\n`;
        total += item.value;
        continue;
      }

      body += `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
      total += item.value;
    }

    return { body, total };
  }

  generateFooter(total, isCSV) {
    let report = '';

    if (isCSV) {
      report += '\nTotal,,\n';
      report += `${total},,\n`;
      return report;
    }

    report += '</table>\n';
    report += `<h3>Total: ${total}</h3>\n`;
    report += '</body></html>\n';
    return report;
  }

}