var async = require("async");
var express = require("express");
var router = express.Router();
const { accountsSum, accountsSumMontlhy } = require("../mongodb/actions");

// SHEET_01
router.get(`/balance`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  let startDate =
    "start-date" in req.query && req.query["start-date"] !== "null"
      ? new Date(req.query["start-date"])
      : null;
  let endDate =
    "end-date" in req.query && req.query["end-date"] !== "null"
      ? new Date(req.query["end-date"])
      : null;

  let accountNames = [
    { id: 11, name: "Caixa" },
    { id: 12, name: "Depósitos à Ordem" },
    { id: 21, name: "Contas a Receber de Clientes" },
    { id: 22, name: "Contas a Pagar a Fornecedores" },
    { id: 24, name: "Estado e Outros Entes Públicos" },
    { id: 31, name: "Compras" },
    { id: 32, name: "Mercadorias em Armazém / Trânsito" },
    { id: 36, name: "Produtos e Trabalhos em Curso" },
    { id: 61, name: "Custo das Mercadorias Vendidas" },
    { id: 62, name: "Fornecimentos e Serviços Externos" },
    { id: 71, name: "Vendas" },
    { id: 72, name: "Prestações de Serviços" }
  ];

  async.series(
    {
      caixa: function(callback) {
        accountsSum(11, startDate, endDate, callback);
      },
      depositos: function(callback) {
        accountsSum(12, startDate, endDate, callback);
      },
      contasReceberClientes: function(callback) {
        accountsSum(21, startDate, endDate, callback);
      },
      contasPagarFornecedores: function(callback) {
        accountsSum(22, startDate, endDate, callback);
      },
      estado: function(callback) {
        accountsSum(24, startDate, endDate, callback);
      },
      compras: function(callback) {
        accountsSum(31, startDate, endDate, callback);
      },
      mercadoriasTransito: function(callback) {
        accountsSum(32, startDate, endDate, callback);
      },
      produtosTrabalho: function(callback) {
        accountsSum(36, startDate, endDate, callback);
      },
      custoMercadoriasVendidas: function(callback) {
        accountsSum(61, startDate, endDate, callback);
      },
      fornecimentosServicosExternos: function(callback) {
        accountsSum(62, startDate, endDate, callback);
      },
      vendas: function(callback) {
        accountsSum(71, startDate, endDate, callback);
      },
      prestacaoServicos: function(callback) {
        accountsSum(72, startDate, endDate, callback);
      }
    },
    function(err, results) {
      if (err) {
        console.log(err);
        return;
      }

      accountNames[0].value = results.caixa;
      accountNames[1].value = results.depositos;
      accountNames[2].value = results.contasReceberClientes;
      accountNames[3].value = results.contasPagarFornecedores;
      accountNames[4].value = results.estado;
      accountNames[5].value = results.compras;
      accountNames[6].value = results.mercadoriasTransito;
      accountNames[7].value = results.produtosTrabalho;
      accountNames[8].value = results.custoMercadoriasVendidas;
      accountNames[9].value = results.fornecimentosServicosExternos;
      accountNames[10].value = results.vendas;
      accountNames[11].value = results.prestacaoServicos;

      res.send(accountNames);
    }
  );
});

// INFO_01
router.get(`/ebit`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  let startDate =
    "start-date" in req.query && req.query["start-date"] !== "null"
      ? new Date(req.query["start-date"])
      : null;
  let endDate =
    "end-date" in req.query && req.query["end-date"] !== "null"
      ? new Date(req.query["end-date"])
      : null;

  async.series(
    {
      earnings: function(callback) {
        accountsSum(7, startDate, endDate, callback);
      },
      expensesCOGS: function(callback) {
        accountsSum(61, startDate, endDate, callback);
      },
      expensesServices: function(callback) {
        accountsSum(62, startDate, endDate, callback);
      },
      expensesPersonnel: function(callback) {
        accountsSum(63, startDate, endDate, callback);
      },
      expensesDepreciationAndAmortization: function(callback) {
        accountsSum(64, startDate, endDate, callback);
      }
    },
    function(err, results) {
      if (err) {
        console.log(err);
        return;
      }

      const ebit =
        results.earnings -
        (results.expensesCOGS +
          results.expensesServices +
          results.expensesPersonnel +
          results.expensesDepreciationAndAmortization);

      res.send({ ebit });
    }
  );
});

// INFO_02
router.get(`/ebitda`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  let startDate =
    "start-date" in req.query && req.query["start-date"] !== "null"
      ? new Date(req.query["start-date"])
      : null;
  let endDate =
    "end-date" in req.query && req.query["end-date"] !== "null"
      ? new Date(req.query["end-date"])
      : null;

  async.series(
    {
      earningsSales: function(callback) {
        accountsSum(71, startDate, endDate, callback);
      },
      earningsServices: function(callback) {
        accountsSum(72, startDate, endDate, callback);
      },
      expensesCOGS: function(callback) {
        accountsSum(61, startDate, endDate, callback);
      },
      expensesServices: function(callback) {
        accountsSum(62, startDate, endDate, callback);
      },
      expensesPersonnel: function(callback) {
        accountsSum(63, startDate, endDate, callback);
      }
    },

    function(err, results) {
      if (err) {
        console.log(err);
        return;
      }

      const ebitda =
        results.earningsSales +
        results.earningsServices -
        (results.expensesCOGS +
          results.expensesServices +
          results.expensesPersonnel);

      res.send({ ebitda });
    }
  );
});

// GRAPH_01
router.get(`/revenue`, function(req, res) {
  if (!req.isLogged) {
    res.status(401).send({ error: "Request unauthorized" });
    return;
  }

  let startDate =
    "start-date" in req.query && req.query["start-date"] !== "null"
      ? new Date(req.query["start-date"])
      : null;
  let endDate =
    "end-date" in req.query && req.query["end-date"] !== "null"
      ? new Date(req.query["end-date"])
      : null;

  let costs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let sales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  async.series(
    {
      account61: function(callback) {
        accountsSumMontlhy(61, startDate, endDate, callback);
      },
      account71: function(callback) {
        accountsSumMontlhy(71, startDate, endDate, callback);
      }
    },
    function(err, results) {
      if (err) {
        console.log(err);
        return;
      }
      let costsData = results.account61;
      let salesData = results.account71;

      for (let i = 1; i <= 12; i++) {
        costs[i] = costsData[i].totalDebit;
        sales[i] = salesData[i].totalCredit;
      }

      res.json({
        revenue: { data: sales, label: "Revenue from Sales" },
        cost: { data: costs, label: "Cost of Goods Sold" }
      });
    }
  );
});

module.exports = router;
