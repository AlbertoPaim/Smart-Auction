# Decentralized Auction Platform

## 📖 Sobre o Projeto

Este repositório contém um **Smart Contract** para um sistema de leilão descentralizado, desenvolvido em Solidity e executado na blockchain Ethereum. A aplicação permite que um administrador (o "dono" do contrato) inicie, gerencie e finalize leilões de forma segura, transparente e imutável.

O contrato implementa uma lógica de leilão inglês, onde os participantes podem fazer lances públicos, e o maior lance ao final do período vence. Uma característica chave é o sistema de **reembolso automático**, que devolve o valor ao licitante anterior assim que um lance maior é feito, garantindo a fluidez e a segurança dos fundos.

Este projeto demonstra competências em desenvolvimento de smart contracts, gerenciamento de estado na blockchain, segurança de fundos e automação de testes com Hardhat.

-----

## ✨ Funcionalidades Principais

  - **Gerenciamento pelo Dono:** Apenas o dono do contrato pode iniciar e finalizar os leilões.
  - **Leilões Dinâmicos:** O dono pode iniciar um leilão para qualquer item, definindo sua duração em minutos.
  - **Lances Públicos e Competitivos:** Qualquer pessoa pode fazer um lance (`placeBid`), desde que o valor seja maior que o lance mais alto atual.
  - **Reembolso Automático:** O contrato devolve automaticamente o valor ao licitante anterior quando um novo lance mais alto é recebido.
  - **Transferência Segura de Fundos:** Ao final do leilão, o valor do lance vencedor é transferido de forma segura e automática para o dono do contrato.
  - **Orientado a Eventos:** O contrato emite eventos (`AuctionStarted`, `NewBid`, `AuctionEnded`) para que aplicações externas (frontends) possam monitorar o status do leilão em tempo real.

-----

## 🛠️ Tecnologias Utilizadas

  - **Linguagem:** Solidity `^0.8.28`
  - **Framework de Desenvolvimento:** [Hardhat](https://hardhat.org/)
  - **Testes:** [Mocha](https://mochajs.org/) & [Chai](https://www.chaijs.com/)
  - **Interação com a Blockchain:** [Ethers.js](https://ethers.org/)
  - **Linguagem de Testes e Scripts:** TypeScript

-----

## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e interagir com o projeto em um ambiente de desenvolvimento local.

### Pré-requisitos

  - [Node.js](https://nodejs.org/en/) (versão 18.x ou superior)
  - `npm` ou `yarn`

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```
2.  Navegue até o diretório do projeto:
    ```bash
    cd seu-repositorio
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```

### Compilando o Contrato

Para compilar o smart contract, execute o seguinte comando:

```bash
npx hardhat compile
```

-----

## ✅ Executando os Testes

Este projeto possui uma suíte de testes completa para garantir o funcionamento correto de todas as funções do contrato. Para executar os testes, utilize o comando:

```bash
npx hardhat test
```

-----

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.
