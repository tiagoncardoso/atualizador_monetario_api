# API Criada para atender a calculadora de atualizações monetárias
## Endpoints e Requisitos:

### Requisitos de sistema:
| Requisito | Versão Mínima |
|-----------|:-------------:|
|npm        |    ^6.x       |
|node       |^14.x          |

***

### Instalação e inicialização:
```shell
$ git clone git@github.com:tiagoncardoso/atualizador_monetario_api.git
$ npm install
$ npm run serve
```

***

### EndPoints disponíveis:


...
> **[GET] /api/ipca/:ano**

> **[GET] /api/inpc/:ano**

Retorna todos os índices segundo o ano passado por parâmetro.

Exemplo de resposta:

```json
{
    "message": "success",
    "data": [
        0.62,
        0.13,
        0.22,
        0.42,
        0.01,
        0.23,
        1.61,
        1.31,
        0.23,
        0.14,
        0.32,
        0.59
    ]
}
```

...

> **[GET] /api/ipca/:anoInicial/:anoFinal**

> **[GET] /api/inpc/:anoInicial/:anoFinal**

Retorna todos os índices segundo um intervalo de anos passado por parâmetro.

Exemplo de resposta:

```json
[
    {
        "ano": 2000,
        "indices": [
            0.62,
            0.13,
            0.22,
            0.42,
            0.01,
            0.23,
            1.61,
            1.31,
            0.23,
            0.14,
            0.32,
            0.59
        ]
    },
    {
        "ano": 2001,
        "indices": [
            0.57,
            0.46,
            0.38,
            0.58,
            0.41,
            0.52,
            1.33,
            0.7,
            0.28,
            0.83,
            0.71,
            0.65
        ]
    },
    {
        "ano": 2002,
        "indices": [
            0.52,
            0.36,
            0.6,
            0.8,
            0.21,
            0.42,
            1.19,
            0.65,
            0.72,
            1.31,
            3.02,
            2.1
        ]
    },
    {
        "ano": 2003,
        "indices": [
            2.25,
            1.57,
            1.23,
            0.97,
            0.61,
            -0.15,
            0.2,
            0.34,
            0.78,
            0.29,
            0.34,
            0.52
        ]
    },
    {
        "ano": 2004,
        "indices": [
            0.76,
            0.61,
            0.47,
            0.37,
            0.51,
            0.71,
            0.91,
            0.69,
            0.33,
            0.44,
            0.69,
            0.86
        ]
    },
    {
        "ano": 2005,
        "indices": [
            0.58,
            0.59,
            0.61,
            0.87,
            0.49,
            -0.02,
            0.25,
            0.17,
            0.35,
            0.75,
            0.55,
            0.36
        ]
    },
    {
        "ano": 2006,
        "indices": [
            0.59,
            0.41,
            0.43,
            0.21,
            0.1,
            -0.21,
            0.19,
            0.05,
            0.21,
            0.33,
            0.31,
            0.48
        ]
    }
]
```

...

> **[GET] /api/available/ipca**

> **[GET] /api/available/inpc**

Retorna todos os anos que já possuem índices cadastrados.

Exemplo de resposta:

```json
{
    "message": "success",
    "anos": [
        1994,
        1995,
        1996,
        1997,
        1998,
        1999,
        2000,
        2001,
        2002,
        2003,
        2004,
        2005,
        2006,
        2007,
        2008,
        2009,
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
        2021,
        2022
    ]
}
```