# Plano de implementação — guia e biografia

**Meta:** ampliar a experiência local com explicações acessíveis e referências ABNT verificadas, incluindo perfil e foto GitHub do autor.

**Arquitetura:** conteúdo didático estático em HTML, integrado à navegação da aplicação existente; explicadores por nível em JavaScript; foto estática local; testes com Node.js, sem dependências novas.

**Especificação:** `GUIA_DESIGN.md`.

## 1. Guia didático
- [x] Escrever teste que comprove a navegação para o guia, as nove descrições TRL, nove SRL, cinco tendências, 17 ODS e referências DOI.
- [x] Executar e observar a falha da função ausente.
- [x] Implementar seção no HTML e acesso por `switchView`.
- [x] Reexecutar o teste até passar.

## 2. Explicação por tecnologia
- [x] Escrever teste para textos contextuais de TRL/SRL e bibliografia acadêmica curada.
- [x] Observar falha, implementar dados e renderização, verificar.
- [x] Manter os dados originais WKO e sinalizar fontes incompletas.

## 3. Perfil e foto do autor
- [x] Escrever teste que exija o perfil GitHub público, foto local e separação da autoria do catálogo original.
- [x] Observar falha, integrar biografia factual e obter avatar público.
- [x] Verificar formato, dimensões e carregamento local.

## 4. Empacotamento e validação
- [x] Rodar toda a suíte existente mais os novos testes.
- [x] Verificar offline, links relativos, HTML e ausência de chamadas automáticas à rede.
- [x] Atualizar `README.md` e cópia em `dist/`.
- [x] Recriar o ZIP sem alterar os dois JSON de origem, verificar seu conteúdo e fornecer link local.

**Foco de revisão:** dados indisponíveis; SRL ausente; múltiplos setores; fontes sem metadados completos; avatar sem acesso à rede.
