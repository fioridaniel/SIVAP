# Guia de Contribuição

Mesmo sendo um projeto de duas pessoas, seguimos boas práticas de organização para garantir um fluxo de trabalho eficiente e profissional.

---

## Pré-requisitos

Antes de começar:

- Certifique-se de ter clonado o repositório corretamente.
- Verifique se o ambiente local está funcionando com as instruções do `README.md`.
- Sempre crie uma branch nova para cada funcionalidade ou correção.

---

## Convenção de Branches

Nomeie suas branches conforme a funcionalidade:

| Tipo       | Prefixo        | Exemplo                        |
|------------|----------------|--------------------------------|
| Funcionalidade | `feature/`     | `feature/login-form`           |
| Correção       | `bugfix/`      | `bugfix/email-validation`      |
| Refatoração    | `refactor/`    | `refactor/user-controller`     |
| Documentação   | `docs/`        | `docs/update-readme`           |
| Tarefa geral   | `chore/`       | `chore/update-dependencies`    |

---

## Padrão de Commits

Utilize o padrão [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit.

### Formato:
```
<tipo>: <mensagem breve no imperativo>
```

### Tipos comuns:
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: mudanças na documentação
- `refactor`: melhoria sem alteração de comportamento
- `test`: adição/modificação de testes
- `chore`: tarefas de manutenção

**Exemplo:**
```
feat: adiciona validação no campo de e-mail
```

---

## Pull Requests

- Crie um PR para a branch `main` ou `dev`, conforme o fluxo.
- Explique claramente o que foi feito no corpo do PR.
- Vincule a issue relacionada (ex: `Closes #12`).
- Solicite revisão do outro membro do projeto.
- Não faça merge do próprio PR sem revisão.

---
