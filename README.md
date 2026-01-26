## 📊 Estrutura de Pages do Dashboard — Estoka

Esta seção descreve apenas as páginas do dashboard (núcleo do sistema), suas responsabilidades e o papel de cada uma no fluxo do usuário.

---

### 🏠 Home — Relatório Geral (`/dashboard/home`)

**Objetivo:**  
Exibir uma visão estratégica do mês atual, sem permitir edições.

**Responsabilidades:**
- Mostrar faturamento total do mês
- Exibir total de peças movimentadas
- Listar faturamento por produto
- (Futuro) Gráficos de evolução mensal

**Não faz:**
- Não edita valores
- Não lança quantidades
- Não cadastra dados

---

### 📊 Relatórios (`/dashboard/relatorios`)

**Objetivo:**  
Permitir análise histórica de faturamento e estoque.

**Responsabilidades:**
- Filtro por período (mês/ano)
- Exibição de totais mensais
- Detalhamento por produto
- Comparação entre meses

**Não faz:**
- Não altera dados operacionais

---

### 📅 Lançamentos (`/dashboard/lancamentos`)

**Objetivo:**  
Tela operacional para lançamento mensal de quantidades.

**Responsabilidades:**
- Selecionar mês e ano
- Informar quantidade por produto
- Salvar lançamentos do período
- Herdar valores do mês anterior quando não houver lançamento

**Não faz:**
- Não edita custos de produtos

---

### 📦 Produtos (`/dashboard/produtos`)

**Objetivo:**  
Gerenciar os dados financeiros dos produtos.

**Responsabilidades:**
- Cadastrar novos produtos
- Editar valor unitário
- Editar IPI
- Editar frete
- Vincular produto a fornecedor

**Não faz:**
- Não altera quantidades mensais

---

### 🏭 Fornecedores (`/dashboard/fornecedores`)

**Objetivo:**  
Organizar fornecedores e seus produtos associados.

**Responsabilidades:**
- Listar fornecedores
- Exibir produtos vinculados a cada fornecedor
- Criar e editar fornecedores
- Ajustar vínculo produto ↔ fornecedor

**Não faz:**
- Não altera valores financeiros
- Não lança quantidades

---

## 🎯 Filosofia de Separação

| Área | Função |
|-----|-------|
Relatórios | Visualização |
Lançamentos | Operacional |
Produtos | Financeiro |
Fornecedores | Organizacional |

Essa separação mantém o sistema simples, seguro e escalável.


----------------------------------------
### Implementações futuras:
- Alterar valores automaticamente por meio do XML da NF.