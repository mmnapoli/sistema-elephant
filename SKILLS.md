# Skills do Claude Code recomendadas

Skills são pastas com instruções/scripts que o Claude Code carrega para executar tarefas
melhor. Você instala uma skill registrando o repositório do GitHub como um **marketplace de
plugins** e depois instalando o plugin/skill. Tudo é feito de forma interativa dentro do
Claude Code com o comando `/plugin` (a confirmação é sua).

## Como instalar

No Claude Code:

```
/plugin marketplace add <usuario/repo>     # registra o repositório como fonte
/plugin install <nome-do-plugin>           # instala a skill/plugin
/plugin                                     # abre o gerenciador (navegar/ativar/desativar)
```

## Recomendadas

| Skill / Repo | Para quê |
|---|---|
| **anthropics/skills** | Skills oficiais da Anthropic (criação de documentos, branding, testes de web app, etc.) |
| **obra/superpowers** | Conjunto de skills de desenvolvimento: TDD, debugging, colaboração |
| Skill de segurança (OWASP/VibeSec) | Revisão de código seguro — encontre nas listas abaixo |

Exemplo:

```
/plugin marketplace add anthropics/skills
/plugin install <skill-desejada>
```

## Listas curadas (para descobrir mais)

- travisvn/awesome-claude-skills — https://github.com/travisvn/awesome-claude-skills
- ComposioHQ/awesome-claude-skills — https://github.com/ComposioHQ/awesome-claude-skills
- daymade/claude-code-skills (marketplace) — https://github.com/daymade/claude-code-skills
- Repositório oficial — https://github.com/anthropics/skills

> Observação: a instalação é interativa e exige sua confirmação; o agente não instala skills
> sozinho. Revise o conteúdo de cada skill antes de ativar.
