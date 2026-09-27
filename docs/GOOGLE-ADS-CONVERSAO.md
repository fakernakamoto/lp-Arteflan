# Conversão de cotação do Google Ads

Destino: `AW-10900216944/WNpCCJzLsIgdEPC40M0o`.

O componente compartilhado `QuoteForm` dispara o evento `conversion` somente após validar nome, empresa/CNPJ e segmento. Isso cobre a seção de cotação da landing, o popup de atacado e `/orcamento`. Abrir a página, clicar nos CTAs ou enviar campos inválidos não dispara essa conversão.

A navegação para o WhatsApp espera `event_callback`, com limite independente de 2 segundos. Se a tag não estiver disponível ou lançar erro, o visitante continua normalmente. O formulário bloqueia submissões repetidas e oferece um link alternativo após o encaminhamento. Nenhum dado pessoal é incluído no evento de conversão.

O destino desta ação é explícito em `src/lib/quote-conversion.ts`; não depende da variável de ambiente do questionário legado. As configurações existentes de consentimento permanecem aplicadas.

Verificação: `npm test` cobre destino, callback, timeout, tag ausente, erro da tag, SSR e validação dos campos. Teste de navegador cobre formulário inválido, submissão válida, dupla submissão, popup, página de cotação e fallback. O transporte de publicidade e o destino WhatsApp são interceptados nos testes automatizados para não enviar leads de teste ao comercial nem contaminar os relatórios.

O evento representa um formulário validado encaminhado ao WhatsApp. Não comprova envio da mensagem no WhatsApp nem atribuição de uma conversão no painel do Google Ads.
