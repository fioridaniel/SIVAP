# Especificações do Projeto: SIVAP (Sistema de Avaliação de Variedades Agrícolas e Produtividade)

## Visão Geral do Sistema
O objetivo deste projeto é desenvolver um banco de dados para auxiliar produtores rurais na avaliação do desempenho de culturas e variedades em suas propriedades. O sistema centralizará as informações em torno do Produtor Rural, que é a entidade fundamental e usuário da aplicação. A estrutura permitirá a coleta de dados detalhados sobre o que foi plantado, onde, quando e como se desempenhou, incluindo observações qualitativas do produtor.

## Entidades e Atributos

### Produtor Rural
O Produtor Rural é a entidade fundamental do sistema e representa o usuário da aplicação.
* **Atributos:**
    * Nome
    * CPF
    * Data de Nascimento
    * Sexo
    * Endereço (composto por rua, bairro, cidade e estado)

### Propriedade
Um produtor pode gerenciar uma ou mais Propriedades, e uma propriedade pode ter um ou mais produtores gerindo-a, representando uma relação de muitos-para-muitos (M:N).
* **Atributos:**
    * Nome
    * Endereço
    * Produção
    * Área em hectares
* **Relacionamento:** Vinculada diretamente a um ou mais produtores.

### Talhão
Dentro de cada propriedade, o sistema organiza as áreas de plantio em Talhões. Um talhão é uma porção específica da propriedade, identificada por um único id auto incrementado e uma área em hectares.
* **Atributos:**
    * ID (auto incrementado, único)
    * Área em hectares
    * Condições climáticas (influenciam nas colheitas de cada cultura)
* **Relacionamento:** Pertence a uma única propriedade.
* **Restrição:** Cada talhão pode conter apenas uma variedade de cultura.

### Cultura
Cultura representa o tipo de plantio principal.
* **Atributos:**
    * Nome (único)
    * Exemplos: Soja, Milho, Trigo

### Variedade
Uma Cultura pode ter diversas Variedades associadas a ela (relação 1:N), sendo cada Variedade identificada por seu próprio código e uma descrição que detalha as características da cultivar específica.
* **Atributos:**
    * Código (próprio)
    * Descrição (detalha as características da cultivar específica)
    * Resistência a Seca (nota de 1 a 5)
    * Produtividade (nota de 1 a 5)
    * Resistência a Pragas (nota de 1 a 5)
    * Ciclo Vegetativo (em meses)
* **Relacionamento:** Uma Cultura pode ter diversas Variedades associadas a ela (relação 1:N).

### Avaliação de Safra
O cerne do sistema de avaliação é a Avaliação de Safra. Esta entidade captura o desempenho de uma variedade específica de uma cultura em um determinado talhão, durante um ciclo de plantio.
* **Atributos:**
    * Data de Plantio
    * Data de Colheita
    * Comentário do Talhão/Produção (campo textual livre onde o produtor pode inserir observações, como problemas de manejo ou qualquer detalhe relevante sobre aquela safra naquele talhão)
* **Relacionamento:** Associada a um único talhão.

## Interconexões e Funcionalidades
Essa estrutura permite que o sistema colete dados detalhados sobre o que foi plantado, onde, quando e como se desempenhou, incluindo as observações qualitativas do produtor. A interconexão dessas entidades possibilita a geração de relatórios e gráficos complexos, como:
* Comparação de produtividade entre variedades
* Análise de rentabilidade por cultura ao longo do tempo
* Identificação de padrões de desempenho em diferentes talhões ou condições

Essas funcionalidades fornecerão insights valiosos para a tomada de decisão no campo.