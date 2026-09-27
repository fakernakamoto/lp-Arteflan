# Conversão de cotação do Google Ads

Destino: `AW-10900216944/WNpCCJzLsIgdEPC40M0o`.

O componente compartilhado `QuoteForm` dispara o evento `conversion` somente após validar nome, telefone/WhatsApp, empresa/CNPJ e segmento. Isso cobre a seção de cotação da landing, o popup de atacado e `/orcamento`. Abrir a página, clicar nos CTAs ou enviar campos inválidos não dispara essa conversão.

A navegação para o WhatsApp espera `event_callback`, com limite independente de 300 ms. Se a tag não estiver disponível ou lançar erro, o visitante continua normalmente. Cabeçalho, botão flutuante e CTA de `/orcamento` encaminham para o formulário, sem link direto para o WhatsApp antes da validação.

O formulário bloqueia submissões repetidas e oferece um link alternativo após o encaminhamento. Nome e telefone são incluídos na mensagem pré-preenchida do WhatsApp. Nenhum dado pessoal é incluído no evento de conversão.

A validação de telefone aceita números brasileiros com DDD, com ou sem +55, e rejeita números incompletos, DDD inválido e sequências repetidas. Valida o formato; confirmar titularidade exigiria um fluxo de verificação por SMS.

Uma aba vazia é reservada no gesto de envio válido para evitar bloqueio de popups. A navegação dessa aba só ocorre após callback da tag ou 300 ms. Se a aba for bloqueada/fechada, a navegação usa a aba atual, após a mesma espera.

O destino desta ação é explícito em `src/lib/quote-conversion.ts`; não depende da variável de ambiente do questionário legado. As configurações existentes de consentimento permanecem aplicadas.

Verificação: `npm test` cobre destino, callback, timeout, tag ausente, erro da tag, SSR e validação dos campos. Teste de navegador cobre formulário inválido, submissão válida, dupla submissão, telefone obrigatório, ausência de atalhos sem validação, popup mobile, página de cotação, callback, espera de 300 ms e fallback de popup bloqueado. O transporte de publicidade e o destino WhatsApp são interceptados nos testes automatizados para não enviar leads de teste ao comercial nem contaminar os relatórios.

O evento representa um formulário validado encaminhado ao WhatsApp. Não comprova envio da mensagem no WhatsApp nem atribuição de uma conversão no painel do Google Ads.
