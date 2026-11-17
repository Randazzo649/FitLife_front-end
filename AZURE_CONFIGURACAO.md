# Configuração de produção do FitLife no Azure

Este arquivo registra os valores de ambiente necessários para os recursos Azure usados pelo monorepo. Os valores `localhost` mantidos nos `application.yml` são fallbacks para desenvolvimento local; não devem ser removidos. No Azure, cadastre as variáveis abaixo em **App Service → Configurações → Variáveis de ambiente**.

## URLs públicas

| Componente | URL |
|---|---|
| Shell (Azure Storage Static Website) | https://fitligemfes.z41.web.core.windows.net/ |
| MFE Cadastro | https://fitlifemfecadastrousuario-h7e7g0e7emfef4b7.mexicocentral-01.azurewebsites.net |
| MFE Perfil | https://fitlifemfeperfil-h0gfcmh9gecshfhf.mexicocentral-01.azurewebsites.net |
| MFE Personal | https://fitlifemfepersonal-h5e6ggcmhhh2f3av.mexicocentral-01.azurewebsites.net |
| MFE Treinos | https://fitlifemfertreino-eneneqd6apc8cda5.mexicocentral-01.azurewebsites.net |
| MFE Comunidade | https://fitlifemfecomunidade-g8g2dtdhh5axdzhr.mexicocentral-01.azurewebsites.net |
| API Gateway | https://fitlifeapigateway-g0enb0dsc2hhe7cp.mexicocentral-01.azurewebsites.net |

## App Service — Cadastro (`FitlifeMFECadastroUsuario`)

| Nome | Valor |
|---|---|
| `FITLIFE_GATEWAY_URL` | `https://fitlifeapigateway-g0enb0dsc2hhe7cp.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_SHELL_URL` | `https://fitligemfes.z41.web.core.windows.net/` |

## App Service — Perfil (`FitlifeMFEPerfil`)

| Nome | Valor |
|---|---|
| `FITLIFE_GATEWAY_URL` | `https://fitlifeapigateway-g0enb0dsc2hhe7cp.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_SHELL_URL` | `https://fitligemfes.z41.web.core.windows.net/` |
| `FITLIFE_SHELL_ORIGIN` | `https://fitligemfes.z41.web.core.windows.net` |
| `FITLIFE_TREINOS_URL` | `https://fitlifemfertreino-eneneqd6apc8cda5.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_PERSONAL_URL` | `https://fitlifemfepersonal-h5e6ggcmhhh2f3av.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_COMUNIDADE_URL` | `https://fitlifemfecomunidade-g8g2dtdhh5axdzhr.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_COOKIE_SAME_SITE` | `None` |
| `FITLIFE_COOKIE_SECURE` | `true` |

Deixe `FITLIFE_COOKIE_DOMAIN` sem valor enquanto não existir um domínio personalizado comum. Não configure `.azurewebsites.net`.

## App Service — Personal (`FitlifeMFEPersonal`)

| Nome | Valor |
|---|---|
| `FITLIFE_GATEWAY_URL` | `https://fitlifeapigateway-g0enb0dsc2hhe7cp.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_SHELL_URL` | `https://fitligemfes.z41.web.core.windows.net/` |
| `FITLIFE_PERFIL_URL` | `https://fitlifemfeperfil-h0gfcmh9gecshfhf.mexicocentral-01.azurewebsites.net` |

## App Service — Treinos (`FitlifeMFERTreino`)

| Nome | Valor |
|---|---|
| `FITLIFE_GATEWAY_URL` | `https://fitlifeapigateway-g0enb0dsc2hhe7cp.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_SHELL_URL` | `https://fitligemfes.z41.web.core.windows.net/` |
| `FITLIFE_PERFIL_URL` | `https://fitlifemfeperfil-h0gfcmh9gecshfhf.mexicocentral-01.azurewebsites.net` |

## App Service — Comunidade (`FitlifeMFEComunidade`)

| Nome | Valor |
|---|---|
| `FITLIFE_GATEWAY_URL` | `https://fitlifeapigateway-g0enb0dsc2hhe7cp.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_SHELL_URL` | `https://fitligemfes.z41.web.core.windows.net/` |
| `FITLIFE_PERFIL_URL` | `https://fitlifemfeperfil-h0gfcmh9gecshfhf.mexicocentral-01.azurewebsites.net` |

## App Service — API Gateway (`FitLifeApiGateway`)

| Nome | Valor |
|---|---|
| `USUARIO_SERVICE_URI` | https://fitlifeusuarioservice-gbc5bdb6fccxc2e2.mexicocentral-01.azurewebsites.net |
| `TREINO_SERVICE_URI` | https://fitlifetreinoservice-a0dbhhc6fxg8c2b0.mexicocentral-01.azurewebsites.net |
| `PERSONAL_SERVICE_URI` | https://fitlifepersonalservice-bdgma4bka7a6f6b7.mexicocentral-01.azurewebsites.net |
| `COMUNIDADE_SERVICE_URI` | https://fitlifecomunidadeservice-bvezezamd9a4brfy.mexicocentral-01.azurewebsites.net |
| `JWT_ISSUER_URI` | Emissor configurado no Usuario Service |
| `JWT_JWK_SET_URI` | `https://fitlifeusuarioservice-gbc5bdb6fccxc2e2.mexicocentral-01.azurewebsites.net/oauth2/jwks` |
| `FITLIFE_FRONTEND_ORIGIN` | `https://fitligemfes.z41.web.core.windows.net` |
| `FITLIFE_CADASTRO_ORIGIN` | `https://fitlifemfecadastrousuario-h7e7g0e7emfef4b7.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_PERFIL_ORIGIN` | `https://fitlifemfeperfil-h0gfcmh9gecshfhf.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_TREINOS_ORIGIN` | `https://fitlifemfertreino-eneneqd6apc8cda5.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_PERSONAL_ORIGIN` | `https://fitlifemfepersonal-h5e6ggcmhhh2f3av.mexicocentral-01.azurewebsites.net` |
| `FITLIFE_COMUNIDADE_ORIGIN` | `https://fitlifemfecomunidade-g8g2dtdhh5axdzhr.mexicocentral-01.azurewebsites.net` |

Confirme os valores já cadastrados antes de substituir qualquer configuração. O emissor (`JWT_ISSUER_URI`) deve permanecer exatamente igual ao claim `iss` emitido pelo Usuario Service.

## Importante: sessão e cookies entre MFEs

O login do Shell chama o BFF do Perfil por uma requisição cross-origin com `credentials: 'include'`. Para esse fluxo, o cookie do Perfil precisa ser emitido com `SameSite=None; Secure`, e o CORS do Perfil precisa permitir exatamente a origem do Shell com credenciais. Por isso estão listadas `FITLIFE_COOKIE_SAME_SITE`, `FITLIFE_COOKIE_SECURE` e `FITLIFE_SHELL_ORIGIN`.

**Isso não compartilha automaticamente o cookie com os outros quatro App Services.** Cada URL `*.mexicocentral-01.azurewebsites.net` pertence a um host diferente, e `azurewebsites.net` é tratado como sufixo público na Public Suffix List. Não configure `FITLIFE_COOKIE_DOMAIN=.azurewebsites.net`: navegadores rejeitam cookies para um sufixo público. Para SSO com os cinco MFEs, será necessário usar domínios personalizados sob o mesmo domínio registrável (por exemplo, `perfil.seudominio`, `treinos.seudominio`, etc., com o cookie no domínio pai) ou implementar um fluxo seguro de troca de sessão/token entre aplicações. `SameSite=None` sozinho não resolve o compartilhamento entre hosts.

Além disso, navegadores podem bloquear cookies de terceiros no pedido `fetch` do Shell para o Perfil mesmo com `SameSite=None; Secure`; teste o login no navegador-alvo. A solução mais robusta é hospedar Shell e MFEs sob domínios personalizados do mesmo site e manter o fluxo de autenticação first-party.

## Quota do Azure

O estado `QuotaExceeded` observado em `FitlifeMFECadastroUsuario` é uma restrição de quota do plano/assinatura do Azure. Nenhuma alteração de HTML, JavaScript, Maven ou variável de URL reativa esse App Service enquanto a quota estiver excedida. Verifique o App Service Plan/Quotas e os limites da assinatura Azure for Students separadamente.
