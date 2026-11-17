# FitLife — Repositório de Frontends (Monorepo)

Este repositório reúne o Shell e todos os Microfrontends do FitLife. **Cada MFE permanece em sua própria pasta e continua sendo uma aplicação Spring Boot independente**, com seu próprio `pom.xml`, camada web com Thymeleaf, arquivos estáticos e BFF.

## Estrutura do repositório

```text
FitLife_Frontend_Repositorio/
├── pom.xml                  # Agregador Maven; não junta o código das aplicações
├── README.md
├── .gitignore
├── shell/                   # Shell estático; publicado no Azure Storage ($web)
├── mfe_cadastro_u/          # Aplicação independente: cadastro + BFF
├── mfe_perfil_u/            # Aplicação independente: perfil + BFF
├── mfe_treinos_u/           # Aplicação independente: treinos + BFF
├── mfe_personal_u/           # Aplicação independente: busca de personal + BFF
└── mfe_comunidade_u/        # Aplicação independente: comunidade/eventos + BFF
```

Os cinco diretórios `mfe_*` ficam **lado a lado na raiz do mesmo repositório Git**. Eles não estão dentro de uma pasta `mfe` comum e não compartilham a mesma aplicação Spring Boot.

O `pom.xml` da raiz é apenas um agregador Maven para facilitar a execução de `mvn test` nos cinco projetos. Cada MFE mantém seu próprio `pom.xml` e pode ser compilado, executado e publicado individualmente.

## Responsabilidades

| Diretório | Responsabilidade | Porta local padrão |
|---|---|---:|
| `shell/` | Navegação e login inicial; direciona para os MFEs | 5500 (Live Server) |
| `mfe_cadastro_u/` | Cadastro de usuário e BFF de cadastro | 8081 |
| `mfe_perfil_u/` | Login, perfil, edição e informações médicas; BFF de autenticação/perfil | 8082 |
| `mfe_treinos_u/` | Consultar e gerenciar treinos; BFF de treinos | 8083 |
| `mfe_personal_u/` | Encontrar personal; BFF de personal | 8084 |
| `mfe_comunidade_u/` | Comunidade, eventos e participações; BFF de comunidade | 8085 |

## Comunicação

```text
Navegador / Shell
       │
       ├── MFE Cadastro ─────── BFF Cadastro ───────┐
       ├── MFE Perfil ───────── BFF Perfil ─────────┤
       ├── MFE Treinos ──────── BFF Treinos ────────┤
       ├── MFE Personal ─────── BFF Personal ───────┤
       └── MFE Comunidade ───── BFF Comunidade ──────┤
                                                    ▼
                                               API Gateway
```

Os JavaScripts chamam somente o BFF do próprio MFE. Cada BFF chama o API Gateway. O Gateway e os microsserviços pertencem ao repositório de backend, separado deste monorepo de frontends.

## Requisitos

- Java 21
- Maven 3.9 ou superior
- Node.js (para verificações opcionais dos arquivos JavaScript)
- API Gateway e microsserviços do repositório de backend em execução para testar os fluxos completos

## Executar localmente

1. Inicie o API Gateway e os microsserviços conforme o README do repositório de backend.
2. Na raiz deste repositório, execute `mvn test` para testar os cinco MFEs no mesmo comando.
3. Para executar apenas um MFE, entre na pasta correspondente e use `mvn spring-boot:run`. Exemplo:

   ```bash
   cd mfe_perfil_u
   mvn spring-boot:run
   ```

4. Repita para os demais MFEs quando necessário. Cada aplicação usa sua porta padrão indicada na tabela.
5. Abra a pasta `shell/` com Live Server. Para desenvolvimento local, use `http://127.0.0.1:5500` e mantenha o mesmo host nos MFEs para o compartilhamento dos cookies locais.

As URLs locais dos MFEs estão centralizadas em `shell/js/config.js`. Para publicação, substitua-as pelas URLs públicas correspondentes.

## Publicação no Azure

- Publique **somente o conteúdo da pasta `shell/`** no contêiner `$web` da Storage Account.
- Publique cada pasta `mfe_*` como uma aplicação Spring Boot independente (por exemplo, um Azure App Service por MFE).
- O Gateway e os microsserviços são publicados pelo repositório de backend, não por este monorepo.
- Em produção, configure domínios e cookies conforme o README do backend; os MFEs precisam de configuração coerente de origem, segurança e domínio de cookie.

## Configuração de produção no Azure

Consulte [`AZURE_CONFIGURACAO.md`](AZURE_CONFIGURACAO.md) para a matriz de variáveis de ambiente, URLs públicas, CORS, cookies e limitações conhecidas de sessão entre domínios.

## Observação sobre validação

Este pacote organiza os cinco MFEs em um único repositório Git. A agregação Maven facilita executar os testes, mas não substitui a execução local com Java/Maven, nem a validação ponta a ponta com Gateway, microsserviços e banco de dados.
