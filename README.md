# SIVAP - Sistema de Avaliação de Variedades Agrícolas e Produtividade

## Visão Geral do Projeto

O **SIVAP - (Sistema de Avaliação de Variedades Agrícolas e Produtividade)** é um banco de dados projetado para auxiliar produtores rurais na avaliação do desempenho de culturas e variedades em suas propriedades. Este sistema centraliza as informações no Produtor Rural, a entidade fundamental e usuário principal da aplicação. A estrutura do banco de dados permitirá a coleta de dados detalhados sobre o que foi plantado, onde, quando e como se desempenhou, incluindo observações qualitativas do produtor.

## Funcionalidades Principais

* **Gestão de Produtores Rurais:** Cadastro e gerenciamento de informações de cada produtor.
* **Gestão de Propriedades:** Registro de propriedades rurais, com vinculação a um ou mais produtores.
* **Organização por Talhões:** Divisão das propriedades em talhões para um controle mais granular das áreas de plantio.
* **Cadastro de Culturas e Variedades:** Definição de tipos de plantio principais (culturas) e suas respectivas variedades, com atributos detalhados de desempenho.
* **Avaliação de Safra:** Registro do desempenho de uma variedade específica de uma cultura em um determinado talhão durante um ciclo de plantio, incluindo datas e comentários.
* **Geração de Relatórios e Gráficos:** Possibilidade de comparar produtividade entre variedades, analisar rentabilidade por cultura e identificar padrões de desempenho em diferentes talhões ou condições.

## Entidades do Modelo de Dados

### 1. Produtor Rural
A entidade fundamental do sistema, representando o usuário da aplicação.
* **Atributos:** Nome, CPF, Data de Nascimento, Sexo, Endereço (composto por rua, bairro, cidade e estado).

### 2. Propriedade
Representa as propriedades rurais gerenciadas pelos produtores.
* **Atributos:** Nome, Endereço, Produção e Área em hectares.
* **Relacionamento:** Muitos-para-muitos (M:N) com `Produtor Rural`. Um produtor pode gerenciar uma ou mais propriedades, e uma propriedade pode ter um ou mais produtores gerindo-a.

### 3. Talhão
Porção específica da propriedade, onde são organizadas as áreas de plantio.
* **Atributos:** ID (auto incrementado e único), Área em hectares, e atributos que determinam suas condições climáticas.
* **Relacionamento:** Um-para-muitos (1:N) com `Propriedade` (um talhão pertence a uma única propriedade).
* **Restrição:** Cada talhão pode conter apenas uma variedade de cultura.

### 4. Cultura
Representa o tipo de plantio principal.
* **Atributos:** Nome (único).
* **Exemplos:** Soja, Milho, Trigo.

### 5. Variedade
Variedades associadas a uma Cultura.
* **Atributos:** Código (próprio), Descrição (detalha as características da cultivar específica), Resistência a Seca (nota de 1 a 5), Produtividade (nota de 1 a 5), Resistência a Pragas (nota de 1 a 5), e Ciclo Vegetativo (em meses).
* **Relacionamento:** Um-para-muitos (1:N) com `Cultura` (uma Cultura pode ter diversas Variedades associadas a ela).

### 6. Avaliação de Safra
O cerne do sistema de avaliação, capturando o desempenho de uma variedade específica de uma cultura em um determinado talhão, durante um ciclo de plantio.
* **Atributos:** Data de Plantio, Data de Colheita, e Comentário do Talhão/Produção (campo textual livre para observações).
* **Relacionamento:** Associada a um único talhão.

## Benefícios Esperados

A interconexão dessas entidades possibilitará a geração de insights valiosos para a tomada de decisão no campo, através de relatórios e gráficos complexos que permitem:
* Comparação de produtividade entre variedades.
* Análise de rentabilidade por cultura ao longo do tempo.
* Identificação de padrões de desempenho em diferentes talhões ou condições.