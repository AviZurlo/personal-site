---
title: 'Programmable Privacy and The Rebirth of UTXO'
date: '2025-12-15'
description: >-
  The race for programmable privacy has come full circle back to the UTXO state model.
tags:
  - crypto
  - investing
source: 
featured: false
---

# Rebirth of UTXO

There are two ways a blockchain can track who owns what: unspent transaction outputs (UTXOs) and accounts.

Bitcoin uses UTXOs. Think of this like cash. You hand over a $20 bill for a $12 purchase, the bill gets destroyed, and two new outputs are created: $12 to the seller and $8 back to you. Every transaction consumes old outputs and produces new ones.

Ethereum uses accounts. Think of this like a bank balance. You have a bank balance, it goes up when you receive, down when you send. Smart contracts are just accounts with code attached that update when someone interacts with them.

Today, the account model is the dominant state model for blockchains, used by every EVM L1 and L2 and even Solana, because it's easier to reason about and therefore easier to build on. Most software is built around objects with state that gets updated in place. A user profile may have a name, email, and balance. An application may read the current value, change it, and write it back. Databases work this way, APIs work this way, backend services work this way. Ethereum's account model follows the same pattern: a smart contract holds data, functions modify that data, you read the result. Developers already think this way, so it's intuitive.

UTXOs aren't so forgiving. Every time you consume a UTXO, you destroy the old and create new ones. That's not how most programmers are trained to think about state. It's closer to functional programming, which is a valid paradigm but a less common one.

But the account model has a structural problem that gets worse the more you care about privacy and scalability. And a wave of UTXO-based projects is starting to show why.

## Why programmable privacy is hard

What does programmable privacy actually mean? One comparative definition might be you can do everything you do on Ethereum today without exposing your balances, transaction history, or counterparties to the entire network. Your financial activity is verified as valid but not visible.

The hard part about programmable privacy is shared state, or in other words hiding a balance while still letting multiple users interact with the same application. 

Think about how a DEX swap works on Ethereum today. The contract reads your token balance, checks the pool's reserves, calculates the exchange rate, executes the transaction, and updates both balances. Every step reads or writes state that's visible to everyone. The contract needs to see your balance to verify you have sufficient balance to complete the trade, and it needs to see the pool to calculate the price.

Now try to make that private. If you hide the pool's reserves, how does the next user know what price they'll get? If you hide balances, how does the contract verify you have enough to trade? If you hide the entire transaction, how does anyone confirm the trade was valid?

The crux of privacy _and_ programmability is that they pull in opposite directions.

The account model makes this tension worse because sharing is the default. Every contract is a shared object that every user reads and writes to. You also face challenges with state contention when two users try to interact with the same private contract at the same time. They're both consuming and updating hidden state and there's no clean way to resolve the conflict when you can't see what's being fought over.

There's also a data availability problem. On a private chain, the contract state is hidden behind commitments and there's no clean way to get the underlying data to future users who might need it without leaking who those users are.

So the question becomes _how do you build a system where state is hidden from the network but still usable by applications and users?_

## How do you get private shared state?

There are three broad approaches, and they map onto different trust and performance tradeoffs.

### 1. Compute on Encrypted State (FHE)

Fully homomorphic encryption lets you perform calculations directly on encrypted data without ever decrypting it. In the blockchain context, this means smart contract logic runs on encrypted balances and produces encrypted outputs. The state is shared (everyone interacts with the same contract) and private (nobody can see the underlying values).

This is the approach [Zama](https://www.zama.org) and [Fhenix](https://www.fhenix.io) are building. Zama's fhEVM is designed to bolt onto any EVM chainas an off-chain coprocessor. This preserves everything developers like about the account model.

The problem is performance. FHE is more computationally expensive to plaintext counterpart by 100-100,000x depending on the operation. [Zama's own numbers put current throughput at roughly 5 TPS for encrypted operations](https://www.zama.org/post/private-smart-contracts-using-homomorphic-encryption). They claim hardware accelerators (FHE ASICs) will push this to 1,000+ TPS, but those don't exist in production yet. There's also a key management problem: someone has to hold the decryption key. Current designs split it across validators using threshold MPC, which means you need a fixed validator set and you're trusting that a supermajority of them don't collude.

FHE also introduces a trust assumption around the coprocessor itself. The heavy computation happens off-chain in a specialized node, and the chain sees only symbolic operations. You can verify correctness with a ZK proof over the FHE computation, but the overhead of proving already-expensive FHE operations makes this impractical.

### 2. Trust the Hardware (TEEs)

Trusted execution environments let nodes execute smart contracts on plaintext inside a hardware "black box" that even the node operator can't peek into. This is how [Secret Network](https://scrt.network) works. Inputs, outputs, and contract state are all encrypted, and the TEE handles decryption, computation, and re-encryption internally.

TEEs are fast and flexible. They can offer full programmability with standard smart contract patterns (eg. Secret uses CosmWasm), and there's no cryptographic overhead because the computation itself is plaintext. The problem with TEEs is the trust model. You're trusting Intel's hardware and attestation service. SGX has had multiple side-channel vulnerabilities — the sgx.fail team [disclosed a design flaw](https://medium.com/initc3org/tee-based-smart-contracts-and-sealing-pitfalls-eccd5d751329) in Secret Network where the developer signing key could theoretically decrypt the master key without exploiting any bug at all. (Secret has since been migrating to a more hardened sealing model, but the underlying dependency on Intel remains.)

TEEs also centralize trust in a specific hardware vendor. If Intel deprecates SGX, which they've been signaling, the entire privacy guarantee disappears.

### 3. State Isolation and Off-chain Coordination (UTXO + ZK)

UTXO are a more privacy-friendly state model than accounts, which the former two paths try to preserve. In a UTXO blockchain, each output is a discrete, self-contained unit of state meaning there's no shared mutable object for multiple transactions to fight over. For anything that doesn't require interaction between users, such as transfers, privacy maps directly onto this model. UTXOs can be hidden behind a cryptographic commitment that lets the network verify validity without seeing the values. The spender proves via a zero-knowledge proof that the committed values satisfy the transaction's constraints. To break the link between sender and receiver, the UTXO gets mixed back into a large pool of valid UTXOs. When you spend it, you prove your UTXO exists somewhere in the pool without revealing which one it is.

But what happens when you need shared state? This is where the off-chain intent-solver coordination comes in. Instead of multiple users reading and writing the same hidden pool, each user publishes a private intent: "I want to sell X of Asset A for at least Y of Asset B". These intents are individual UTXOs with spending conditions attached. An off-chain solver matches compatible intents, constructs the combined transaction, and submits a single proof that all conditions were satisfied. This means "shared state" never exists as a persistent on-chain object, rather it's reconstructed transiently by the solver at the moment of settlement.

Solver-based systems introduce their own problems. Who runs the solvers? How do you prevent them from extracting value? How do you ensure solver competition is fair? And it can become a bottleneck for some applications that update shared state frequently. The developer experience is also harder.

### Where does this leave us?

If you believe FHE ASICs will ship and close the performance gap, the account model can potentially get private shared state without changing its fundamental architecture. If you believe hardware trust is acceptable, TEEs already work. But if you want cryptographic privacy without hardware dependencies, and you think the solver/intent pattern is the right coordination primitive — which the DeFi space is increasingly betting on with [CowSwap](https://cow.fi), [UniswapX](https://uniswap.org/whitepaper-uniswapx.pdf), and similar designs — then UTXO is the better foundation.

## Programmable Privacy Through UTXOs and ZK

In 2016 [Zcash](https://z.cash) demonstrated you could hide UTXOs behind cryptographic commitments, prevent double-spending with nullifiers (without revealing which note was spent), and use zero-knowledge proofs to prove to the network that value was conserved. Every privacy UTXO project since has built upon this basic pattern.

Zcash has two problems though. Privacy is opt-in — only about 30% of ZEC sits in shielded pools, and [researchers have deanonymized](https://www.ccn.com/news/technology/privacy-coin-53-zcash-transactions-deanonimyzed/) over half of all transaction volume by watching transparent-side patterns. And there's no programmability. You can only send and receive private money. There have been proposals such as [Ztarknet](https://theweal.com/2026/02/07/breaking-crypto-news-zcash-updates-and-future-outlook/amp/) to add programmability, but nothing has matured. The main active effort, [Project Tachyon](https://tachyon.z.cash/overview/), is purely focused on scaling — not programmability. Zcash has doubled down on being "encrypted Bitcoin."

[Aleo](https://aleo.org) is the most direct successor. It extends Zcash's notes into "records" that can hold arbitrary data, not just a value and address. Programs execute off-chain, consuming and producing records as state transitions — giving you privacy-preserving smart contracts. Aleo's major problem is the one we've been discussing: composability. Private records from different applications can't read each other's state. For anything requiring shared state, you get pushed into Aleo's [public mappings](https://developer.aleo.org/concepts/fundamentals/public_private/), which are just transparent on-chain key-value stores. Privacy weakens exactly where you'd want it most.

[Nockchain](https://nockchain.org) takes the intent-solver approach described above and builds it directly into the state model. UTXO notes use a [Merkelized tree of spending conditions](https://www.nockchain.org/transactions/) (similar to Bitcoin's Taproot), and off-chain solvers execute matching intents in batches with a single proof. Nockchain's ZK-PoW consensus is also worth noting — miners generate ZK proofs as the work itself rather than grinding hashes, creating a competition to drive down the cost of proof generation. Today, asset amounts are visible on-chain and there's no equivalent of shielded pools, though [privacy is planned](https://www.nockchain.org/roadmap) at the transaction level.

[Neptune](https://neptune.cash) makes the privacy-composability tradeoff explicit in the data model itself. "Lockable" UTXOs carry hidden state, pass through a [mutator set](https://neptune.cash/blog/mutator-sets/) that functions as the cryptographic accumulator described above, and give you full privacy of amounts, identities, and the transaction graph. "Lock-free" UTXOs are public, use the L1 for data availability, and support parallel composability. A single transaction can include both types, which means developers choose privacy vs. composability per-output rather than per-program.

Each project arrived independently at the same set of primitives: discrete units of private state, zero-knowledge proofs for validity, off-chain execution with on-chain settlement, and intent-like declarative transactions. The tradeoffs differ, but the architecture underneath is the same.

UTXOs doesn't solve everything automatically. Programmable UTXO systems are harder to build, harder to reason about, and the tooling is thinner. That said, UTXOs are better suited to the problems that actually matter for programmable privacy in the near-term.
