// Create express app
const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./database");

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// Server port
const HTTP_PORT = 8000;

// Start server
app.listen(HTTP_PORT, () => {
  console.log(
    "Server is now running on port %PORT%".replace("%PORT%", HTTP_PORT)
  );
});

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ status: "Server is UP" });
});

app.get("/api/ipca/:ano/", (req, res, next) => {
  const query = "SELECT indices FROM ipca WHERE ano = ?";
  let params = [req.params.ano];

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    let result = [];

    rows.forEach((row) => {
      result = JSON.parse(row.indices);
    });

    res.json({
      message: "success",
      indices: result,
    });
  });
});

app.get("/api/inpc/:ano/", (req, res, next) => {
  const query = "SELECT indices FROM inpc WHERE ano = ?";
  let params = [req.params.ano];

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    let result = [];

    rows.forEach((row) => {
      result = JSON.parse(row.indices);
    });

    res.json({
      message: "success",
      indices: result,
    });
  });
});

app.get("/api/ipca/:anoInicial/:anoFinal", (req, res, next) => {
  const query = "SELECT * FROM ipca WHERE ano BETWEEN ? AND ?";
  let params = [req.params.anoInicial, req.params.anoFinal];

  if (req.params.anoInicial > req.params.anoFinal) {
    res
      .status(400)
      .json({
        error:
          "Para esta consulta é necessário que o ano inicial seja anterior ao ano final.",
      });
    return;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    let result = [];

    rows.forEach((row) => {
      result.push({
        ano: row.ano,
        indices: JSON.parse(row.indices),
      });
    });

    res.json(result);
  });
});

app.get("/api/inpc/:anoInicial/:anoFinal/", (req, res, next) => {
  const query = "SELECT * FROM inpc WHERE ano BETWEEN ? AND ?";
  let params = [req.params.anoInicial, req.params.anoFinal];

  if (req.params.anoInicial > req.params.anoFinal) {
    res
      .status(400)
      .json({
        error:
          "Para esta consulta é necessário que o ano inicial seja anterior ao ano final.",
      });
    return;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    let result = [];

    rows.forEach((row) => {
      result.push({
        ano: row.ano,
        indices: JSON.parse(row.indices),
      });
    });

    res.json(result);
  });
});

app.get("/api/available/ipca", (req, res, next) => {
  const query = "SELECT ano FROM ipca";
  let params = [];

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    let result = [];

    rows.forEach((row) => {
      result.push(row.ano);
    });

    res.json({
      message: "success",
      anos: result,
    });
  });
});

app.get("/api/available/inpc", (req, res, next) => {
  const query = "SELECT ano FROM inpc";
  let params = [];

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    let result = [];

    rows.forEach((row) => {
      result.push(row.ano);
    });

    res.json({
      message: "success",
      anos: result,
    });
  });
});

app.get("/api/estado", (req, res, next) => {
  const query = "SELECT * FROM estado";
  let params = [];

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      estados: rows,
    });
  });
});

app.get("/api/:estadoId/cidades", (req, res, next) => {
  const query = "SELECT * FROM cidade WHERE estado_id = ?";
  let params = [req.params.estadoId];

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      cidades: rows,
    });
  });
});

app.post("/api/usuario", (req, res) => {
  const usuario = req.body.usuario;
  const contato = req.body.contato;
  const pessoa = req.body.pessoa;
  let usuarioId;
  let contatoId;
  let pessoaId;

  let usuarioParams = Object.values(usuario);
  usuarioParams.push("INATIVO");

  db.run(
    `INSERT INTO usuario
        (usuario, senha, status)
        VALUES
        (?, ?, ?)`,
    usuarioParams,
    function (err) {
      usuarioId = this.lastID;
    }
  );

  let contatoParams = Object.values(contato);
  db.run(
    `INSERT INTO contato
        (logradouro, numero, complemento, bairro, cep, uf, cidade, telefone, email, email2)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    contatoParams,
    function (err) {
      contatoId = this.lastID;
    }
  );

  setTimeout(() => {
    let pessoaParams = Object.values(pessoa);
    pessoaParams.push(contatoId, usuarioId);
    console.log(pessoaParams);
    db.run(
      `INSERT INTO pessoa
            (nome, nascimento, genero, cpf, rg, uf_rg, contato, usuario)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)`,
      pessoaParams,
      function (err) {
        pessoaId = this.lastID;
      }
    );

    res.json({
      message: "Novo cadastro realizado com sucesso",
      error: false,
    });
  }, 1000);
});

app.get("/api/usuario", (req, res, next) => {
  db.all(
    `SELECT 
        pe.id,
        pe.nome,
        pe.nascimento,
        pe.genero,
        pe.cpf,
        pe.rg,
        est_con.uf AS 'uf_rg',
        co.logradouro,
        co.numero,
        co.complemento,
        co.bairro,
        co.cep,
        est_con.uf,
        cid_con.nome AS 'cidade',
        co.telefone,
        co.email,
        co.email2,
        us.usuario,
        us.senha,
        us.status
    FROM pessoa pe
        INNER JOIN contato co ON pe.contato = co.id
        INNER JOIN usuario us ON pe.usuario = us.id
        INNER JOIN estado est_rg ON pe.uf_rg = est_rg.id
        INNER JOIN estado est_con ON co.uf = est_con.id
        INNER JOIN cidade cid_con ON co.cidade = cid_con.id
        `,
    [],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      res.json({
        message: "success",
        usuarios: rows,
      });
    }
  );
});

app.get("/api/:usuarioId/usuario", (req, res, next) => {
  const query = `SELECT 
    pe.id,
    pe.nome,
    pe.nascimento,
    pe.genero,
    pe.cpf,
    pe.rg,
    est_con.uf AS 'uf_rg',
    co.logradouro,
    co.numero,
    co.complemento,
    co.bairro,
    co.cep,
    est_con.uf,
    cid_con.nome AS 'cidade',
    co.telefone,
    co.email,
    co.email2,
    us.usuario,
    us.senha,
    us.status
FROM pessoa pe
    INNER JOIN contato co ON pe.contato = co.id
    INNER JOIN usuario us ON pe.usuario = us.id
    INNER JOIN estado est_rg ON pe.uf_rg = est_rg.id
    INNER JOIN estado est_con ON co.uf = est_con.id
    INNER JOIN cidade cid_con ON co.cidade = cid_con.id
    WHERE us.id = ?
    `;
  const params = [req.params.usuarioId];

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      usuario: rows[0] ?? [],
    });
  });
});

app.put("/api/usuario/:pessoaId", (req, res) => {
  const usuario = req.body.usuario;
  const contato = req.body.contato;
  const pessoa = req.body.pessoa;
  let usuarioId;
  let contatoId;
  let pessoaId;

  db.all(
    `SELECT pe.id, pe.contato, pe.usuario FROM pessoa pe WHERE pe.id = ?`,
    [req.params.pessoaId],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      pessoaId = rows[0].id;
      contatoId = rows[0].contato;
      usuarioId = rows[0].usuario;
    }
  );

  setTimeout(() => {
    let usuarioParams = Object.values(usuario);

    db.run(
      `UPDATE usuario SET usuario = ? WHERE id = ?`,
      [...usuarioParams, usuarioId],
      function (err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
      }
    );

    let contatoParams = Object.values(contato);

    db.run(
      `UPDATE contato SET
            logradouro = ?, numero = ?, complemento = ?, bairro = ?, cep = ?, uf = ?, cidade = ?, telefone = ?, email = ?, email2 = ?
            WHERE id = ?`,
      [...contatoParams, contatoId],
      function (err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
      }
    );

    let pessoaParams = Object.values(pessoa);

    db.run(
      `UPDATE pessoa SET
            nome = ?, nascimento = ?, genero = ?, cpf = ?, rg = ?, uf_rg = ?
            WHERE id = ?`,
      [...pessoaParams, pessoaId],
      function (err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        res.json({
          status: "success",
          message: "Os dados foram atualizados com sucesso.",
        });
      }
    );
  }, 1000);
});

app.put("/api/status/usuario/:pessoaId", (req, res) => {
  const status = req.body.status;
  let usuarioId;

  if (!["ATIVO", "INATIVO", "BLOQUEADO"].includes(status)) {
    res
      .status(400)
      .json({
        error: true,
        message: "Status inválido. Status aceitos: [ATIVO, INATIVO, BLOQUEADO]",
      });
    return;
  }

  db.all(
    `SELECT pe.id, pe.contato, pe.usuario FROM pessoa pe WHERE pe.id = ?`,
    [req.params.pessoaId],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      usuarioId = rows[0].usuario;
    }
  );

  setTimeout(() => {
    let statusParams = status;

    db.run(
      `UPDATE usuario SET status = ? WHERE id = ?`,
      [statusParams, usuarioId],
      function (err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        res.json({
          status: "success",
          message: "Status atualizado com sucesso.",
        });
      }
    );
  }, 1000);
});

app.put("/api/password/usuario/:pessoaId", (req, res) => {
  const password = req.body.senha;
  let usuarioId;

  db.all(
    `SELECT pe.id, pe.contato, pe.usuario FROM pessoa pe WHERE pe.id = ?`,
    [req.params.pessoaId],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      usuarioId = rows[0].usuario;
    }
  );

  setTimeout(() => {
    let passwordParams = password;

    db.run(
      `UPDATE usuario SET senha = ? WHERE id = ?`,
      [passwordParams, usuarioId],
      function (err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        res.json({
          status: "success",
          message: "Senha atualizada com sucesso.",
        });
      }
    );
  }, 1000);
});

app.delete("/api/usuario/:pessoaId", (req, res) => {
  const status = req.body.status;
  let usuarioId;
  let contatoId;
  let pessoaId;

  db.all(
    `SELECT pe.id, pe.contato, pe.usuario FROM pessoa pe WHERE pe.id = ?`,
    [req.params.pessoaId],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      pessoaId = rows[0].id;
      contatoId = rows[0].contato;
      usuarioId = rows[0].usuario;
    }
  );

  setTimeout(() => {
    db.run(`DELETE FROM pessoa WHERE id = ?`, [pessoaId], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
    });

    db.run(`DELETE FROM usuario WHERE id = ?`, [usuarioId], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
    });

    db.run(`DELETE FROM contato WHERE id = ?`, [contatoId], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      res.json({
        status: "success",
        message: "Usuário removido com sucesso.",
      });
    });
  }, 1000);
});

// Default reponse for any other request
app.use((req, res) => {
  res.status(404);
});
