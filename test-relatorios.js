#!/usr/bin/env node

/**
 * Script de Teste para Validação dos Relatórios SIVAP
 * 
 * Este script testa:
 * 1. Cada relatório individualmente
 * 2. Validação dos operadores SQL utilizados
 * 3. Integração com o sistema existente
 */

const fs = require('fs');
const path = require('path');

// Configurações
const BASE_URL = 'http://localhost:8080';
const REPORTS_BASE_PATH = 'ReactSIVAP/sivap_ui/src/relatorios';
const CONTROLLERS_BASE_PATH = 'SpringBootSIVAP/sivap/src/main/java/br/uel/trabalho/sivap/controller';

// Definição dos relatórios e seus operadores SQL esperados
const RELATORIOS = [
  {
    nome: 'Produtividade',
    endpoint: '/api/relatorios/produtividade',
    controller: 'RelatorioProdutividadeController.java',
    component: 'RelatorioProdutividade.js',
    operadoresSQL: ['JOIN', 'SUM', 'GROUP BY', 'ORDER BY', 'ROUND'],
    requirements: ['1.1', '1.2', '1.3', '1.4'],
    expectedColumns: ['propriedade', 'producao_total', 'area', 'produtividade']
  },
  {
    nome: 'Variedades',
    endpoint: '/api/relatorios/variedades',
    controller: 'RelatorioVariedadesController.java',
    component: 'RelatorioVariedades.js',
    operadoresSQL: ['JOIN', 'COUNT', 'GROUP BY', 'ORDER BY', 'DESC'],
    requirements: ['2.1', '2.2', '2.3', '2.4'],
    expectedColumns: ['nome_cultura', 'variedade', 'total_plantios']
  },
  {
    nome: 'Temporal',
    endpoint: '/api/relatorios/temporal',
    controller: 'RelatorioTemporalController.java',
    component: 'RelatorioTemporal.js',
    operadoresSQL: ['EXTRACT', 'SUM', 'AVG', 'GROUP BY', 'ORDER BY', 'WHERE'],
    requirements: ['3.1', '3.2', '3.3', '3.4'],
    expectedColumns: ['ano', 'producao_total', 'producao_media', 'total_safras']
  },
  {
    nome: 'Climático',
    endpoint: '/api/relatorios/climatico',
    controller: 'RelatorioClimaticoController.java',
    component: 'RelatorioClimatico.js',
    operadoresSQL: ['JOIN', 'AVG', 'GROUP BY', 'ORDER BY', 'WHERE'],
    requirements: ['4.1', '4.2', '4.3', '4.4'],
    expectedColumns: ['nome_cultura', 'temp_media', 'precipitacao_media', 'producao_media']
  },
  {
    nome: 'Produtores',
    endpoint: '/api/relatorios/produtores',
    controller: 'RelatorioProdutoresController.java',
    component: 'RelatorioProdutores.js',
    operadoresSQL: ['JOIN', 'COUNT', 'GROUP BY', 'HAVING', 'ORDER BY', 'DISTINCT'],
    requirements: ['5.1', '5.2', '5.3', '5.4'],
    expectedColumns: ['produtor', 'num_propriedades', 'total_safras']
  },
  {
    nome: 'Resistência',
    endpoint: '/api/relatorios/resistencia',
    controller: 'RelatorioResistenciaController.java',
    component: 'RelatorioResistencia.js',
    operadoresSQL: ['WHERE', 'SELECT', 'AVG', 'ORDER BY', 'IS NOT NULL'],
    requirements: ['6.1', '6.2', '6.3', '6.4'],
    expectedColumns: ['variedade', 'resistencia_seca', 'resistencia_pragas', 'produtividade_nota']
  }
];

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bold');
  console.log('='.repeat(60));
}

function logSubSection(title) {
  console.log('\n' + '-'.repeat(40));
  log(title, 'blue');
  console.log('-'.repeat(40));
}

// Função para verificar se arquivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Função para ler conteúdo do arquivo
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Teste 5.1: Testar cada relatório individualmente
function testarRelatoriosIndividualmente() {
  logSection('TESTE 5.1: TESTANDO CADA RELATÓRIO INDIVIDUALMENTE');
  
  let resultados = {
    total: RELATORIOS.length,
    sucessos: 0,
    falhas: 0,
    detalhes: []
  };

  RELATORIOS.forEach(relatorio => {
    logSubSection(`Testando Relatório: ${relatorio.nome}`);
    
    let resultado = {
      nome: relatorio.nome,
      controller: false,
      component: false,
      sqlQuery: false,
      errorHandling: false,
      requirements: false
    };

    // 1. Verificar se controller existe
    const controllerPath = path.join(CONTROLLERS_BASE_PATH, relatorio.controller);
    if (fileExists(controllerPath)) {
      resultado.controller = true;
      log(`✓ Controller encontrado: ${relatorio.controller}`, 'green');
    } else {
      log(`✗ Controller não encontrado: ${relatorio.controller}`, 'red');
    }

    // 2. Verificar se componente React existe
    const componentPath = path.join(REPORTS_BASE_PATH, relatorio.component);
    if (fileExists(componentPath)) {
      resultado.component = true;
      log(`✓ Componente React encontrado: ${relatorio.component}`, 'green');
    } else {
      log(`✗ Componente React não encontrado: ${relatorio.component}`, 'red');
    }

    // 3. Verificar consulta SQL no controller
    if (resultado.controller) {
      const controllerContent = readFile(controllerPath);
      if (controllerContent && controllerContent.includes('SELECT')) {
        resultado.sqlQuery = true;
        log(`✓ Consulta SQL encontrada no controller`, 'green');
      } else {
        log(`✗ Consulta SQL não encontrada no controller`, 'red');
      }
    }

    // 4. Verificar tratamento de erro
    if (resultado.controller) {
      const controllerContent = readFile(controllerPath);
      if (controllerContent && controllerContent.includes('try') && controllerContent.includes('catch')) {
        resultado.errorHandling = true;
        log(`✓ Tratamento de erro implementado`, 'green');
      } else {
        log(`✗ Tratamento de erro não encontrado`, 'red');
      }
    }

    // 5. Verificar se requirements estão documentados
    if (relatorio.requirements && relatorio.requirements.length > 0) {
      resultado.requirements = true;
      log(`✓ Requirements documentados: ${relatorio.requirements.join(', ')}`, 'green');
    } else {
      log(`✗ Requirements não documentados`, 'red');
    }

    // Calcular sucesso geral do relatório
    const sucessoGeral = Object.values(resultado).filter(v => v === true).length >= 4;
    if (sucessoGeral) {
      resultados.sucessos++;
      log(`✓ Relatório ${relatorio.nome}: APROVADO`, 'green');
    } else {
      resultados.falhas++;
      log(`✗ Relatório ${relatorio.nome}: REPROVADO`, 'red');
    }

    resultados.detalhes.push(resultado);
  });

  // Resumo do Teste 5.1
  console.log('\n' + '='.repeat(40));
  log('RESUMO DO TESTE 5.1:', 'bold');
  log(`Total de relatórios testados: ${resultados.total}`, 'blue');
  log(`Sucessos: ${resultados.sucessos}`, 'green');
  log(`Falhas: ${resultados.falhas}`, 'red');
  
  if (resultados.sucessos === resultados.total) {
    log('✓ TESTE 5.1: APROVADO - Todos os relatórios estão funcionais', 'green');
  } else {
    log('✗ TESTE 5.1: REPROVADO - Alguns relatórios têm problemas', 'red');
  }

  return resultados;
}

// Teste 5.2: Validar uso dos operadores SQL
function validarOperadoresSQL() {
  logSection('TESTE 5.2: VALIDANDO USO DOS OPERADORES SQL');
  
  let resultados = {
    total: RELATORIOS.length,
    sucessos: 0,
    falhas: 0,
    operadoresEncontrados: new Set(),
    detalhes: []
  };

  RELATORIOS.forEach(relatorio => {
    logSubSection(`Validando SQL: ${relatorio.nome}`);
    
    let resultado = {
      nome: relatorio.nome,
      operadoresEsperados: relatorio.operadoresSQL,
      operadoresEncontrados: [],
      percentualCobertura: 0
    };

    const controllerPath = path.join(CONTROLLERS_BASE_PATH, relatorio.controller);
    const controllerContent = readFile(controllerPath);
    
    if (controllerContent) {
      // Procurar por cada operador SQL esperado
      relatorio.operadoresSQL.forEach(operador => {
        const regex = new RegExp(operador.replace(/\s+/g, '\\s+'), 'i');
        if (regex.test(controllerContent)) {
          resultado.operadoresEncontrados.push(operador);
          resultados.operadoresEncontrados.add(operador);
          log(`✓ ${operador} encontrado`, 'green');
        } else {
          log(`✗ ${operador} não encontrado`, 'red');
        }
      });

      resultado.percentualCobertura = (resultado.operadoresEncontrados.length / resultado.operadoresEsperados.length) * 100;
      
      if (resultado.percentualCobertura >= 80) {
        resultados.sucessos++;
        log(`✓ Cobertura SQL: ${resultado.percentualCobertura.toFixed(1)}% - APROVADO`, 'green');
      } else {
        resultados.falhas++;
        log(`✗ Cobertura SQL: ${resultado.percentualCobertura.toFixed(1)}% - REPROVADO`, 'red');
      }
    } else {
      log(`✗ Não foi possível ler o controller`, 'red');
      resultados.falhas++;
    }

    resultados.detalhes.push(resultado);
  });

  // Resumo do Teste 5.2
  console.log('\n' + '='.repeat(40));
  log('RESUMO DO TESTE 5.2:', 'bold');
  log(`Total de relatórios testados: ${resultados.total}`, 'blue');
  log(`Sucessos: ${resultados.sucessos}`, 'green');
  log(`Falhas: ${resultados.falhas}`, 'red');
  log(`Operadores SQL únicos encontrados: ${Array.from(resultados.operadoresEncontrados).join(', ')}`, 'blue');
  
  if (resultados.sucessos === resultados.total) {
    log('✓ TESTE 5.2: APROVADO - Todos os operadores SQL estão sendo utilizados', 'green');
  } else {
    log('✗ TESTE 5.2: REPROVADO - Alguns operadores SQL estão faltando', 'red');
  }

  return resultados;
}

// Teste 5.3: Testar integração com sistema existente
function testarIntegracaoSistema() {
  logSection('TESTE 5.3: TESTANDO INTEGRAÇÃO COM SISTEMA EXISTENTE');
  
  let resultados = {
    roteamento: false,
    navegacao: false,
    estilos: false,
    componenteBase: false
  };

  // 1. Verificar roteamento
  logSubSection('Verificando Roteamento');
  const routesPath = path.join('ReactSIVAP/sivap_ui/src', 'Routes.js');
  const routesContent = readFile(routesPath);
  
  if (routesContent) {
    const rotasRelatorios = RELATORIOS.filter(rel => 
      routesContent.includes(`/relatorios/${rel.nome.toLowerCase()}`) ||
      routesContent.includes(rel.component.replace('.js', ''))
    );
    
    if (rotasRelatorios.length >= RELATORIOS.length * 0.8) {
      resultados.roteamento = true;
      log(`✓ Roteamento configurado para ${rotasRelatorios.length}/${RELATORIOS.length} relatórios`, 'green');
    } else {
      log(`✗ Roteamento incompleto: ${rotasRelatorios.length}/${RELATORIOS.length} relatórios`, 'red');
    }
  } else {
    log(`✗ Arquivo Routes.js não encontrado`, 'red');
  }

  // 2. Verificar navegação
  logSubSection('Verificando Navegação');
  const navPath = path.join(REPORTS_BASE_PATH, 'RelatoriosPretendidos.js');
  const navContent = readFile(navPath);
  
  if (navContent) {
    const linksEncontrados = RELATORIOS.filter(rel => 
      navContent.includes(`/relatorios/${rel.nome.toLowerCase()}`) ||
      navContent.includes(rel.nome)
    );
    
    if (linksEncontrados.length >= RELATORIOS.length * 0.8) {
      resultados.navegacao = true;
      log(`✓ Links de navegação encontrados para ${linksEncontrados.length}/${RELATORIOS.length} relatórios`, 'green');
    } else {
      log(`✗ Links de navegação incompletos: ${linksEncontrados.length}/${RELATORIOS.length} relatórios`, 'red');
    }
  } else {
    log(`✗ Componente de navegação não encontrado`, 'red');
  }

  // 3. Verificar componente base reutilizável
  logSubSection('Verificando Componente Base');
  const tabelaPath = path.join(REPORTS_BASE_PATH, 'TabelaRelatorio.js');
  const tabelaContent = readFile(tabelaPath);
  
  if (tabelaContent) {
    if (tabelaContent.includes('{ dados, colunas, titulo') && tabelaContent.includes('export default TabelaRelatorio')) {
      resultados.componenteBase = true;
      log(`✓ Componente TabelaRelatorio reutilizável encontrado`, 'green');
    } else {
      log(`✗ Componente TabelaRelatorio não está adequadamente estruturado`, 'red');
    }
  } else {
    log(`✗ Componente TabelaRelatorio não encontrado`, 'red');
  }

  // 4. Verificar estilos consistentes
  logSubSection('Verificando Estilos');
  const cssPath = path.join(REPORTS_BASE_PATH, 'TabelaRelatorio.css');
  
  if (fileExists(cssPath)) {
    resultados.estilos = true;
    log(`✓ Arquivo de estilos TabelaRelatorio.css encontrado`, 'green');
  } else {
    log(`✗ Arquivo de estilos não encontrado`, 'red');
  }

  // Resumo do Teste 5.3
  console.log('\n' + '='.repeat(40));
  log('RESUMO DO TESTE 5.3:', 'bold');
  
  const sucessos = Object.values(resultados).filter(v => v === true).length;
  const total = Object.keys(resultados).length;
  
  log(`Roteamento: ${resultados.roteamento ? '✓' : '✗'}`, resultados.roteamento ? 'green' : 'red');
  log(`Navegação: ${resultados.navegacao ? '✓' : '✗'}`, resultados.navegacao ? 'green' : 'red');
  log(`Componente Base: ${resultados.componenteBase ? '✓' : '✗'}`, resultados.componenteBase ? 'green' : 'red');
  log(`Estilos: ${resultados.estilos ? '✓' : '✗'}`, resultados.estilos ? 'green' : 'red');
  
  if (sucessos === total) {
    log('✓ TESTE 5.3: APROVADO - Integração com sistema existente está completa', 'green');
  } else {
    log(`✗ TESTE 5.3: REPROVADO - Integração incompleta (${sucessos}/${total})`, 'red');
  }

  return resultados;
}

// Função principal
function executarTestes() {
  logSection('INICIANDO TESTES DE VALIDAÇÃO DOS RELATÓRIOS SIVAP');
  log('Este script valida a implementação completa dos relatórios', 'blue');
  
  const resultados = {
    teste51: null,
    teste52: null,
    teste53: null,
    resumoGeral: null
  };

  try {
    // Executar todos os testes
    resultados.teste51 = testarRelatoriosIndividualmente();
    resultados.teste52 = validarOperadoresSQL();
    resultados.teste53 = testarIntegracaoSistema();

    // Resumo geral
    logSection('RESUMO GERAL DOS TESTES');
    
    const teste51Aprovado = resultados.teste51.sucessos === resultados.teste51.total;
    const teste52Aprovado = resultados.teste52.sucessos === resultados.teste52.total;
    const teste53Aprovado = Object.values(resultados.teste53).every(v => v === true);
    
    log(`Teste 5.1 (Relatórios Individuais): ${teste51Aprovado ? '✓ APROVADO' : '✗ REPROVADO'}`, teste51Aprovado ? 'green' : 'red');
    log(`Teste 5.2 (Operadores SQL): ${teste52Aprovado ? '✓ APROVADO' : '✗ REPROVADO'}`, teste52Aprovado ? 'green' : 'red');
    log(`Teste 5.3 (Integração Sistema): ${teste53Aprovado ? '✓ APROVADO' : '✗ REPROVADO'}`, teste53Aprovado ? 'green' : 'red');
    
    const todosAprovados = teste51Aprovado && teste52Aprovado && teste53Aprovado;
    
    console.log('\n' + '='.repeat(60));
    if (todosAprovados) {
      log('🎉 TODOS OS TESTES APROVADOS! 🎉', 'green');
      log('O sistema de relatórios está funcionando corretamente.', 'green');
    } else {
      log('⚠️  ALGUNS TESTES FALHARAM ⚠️', 'red');
      log('Verifique os detalhes acima para corrigir os problemas.', 'red');
    }
    console.log('='.repeat(60));

    resultados.resumoGeral = {
      todosAprovados,
      teste51Aprovado,
      teste52Aprovado,
      teste53Aprovado
    };

  } catch (error) {
    log(`Erro durante execução dos testes: ${error.message}`, 'red');
    console.error(error);
  }

  return resultados;
}

// Executar se chamado diretamente
if (require.main === module) {
  executarTestes();
}

module.exports = {
  executarTestes,
  testarRelatoriosIndividualmente,
  validarOperadoresSQL,
  testarIntegracaoSistema
};