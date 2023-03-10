import { useWallet } from '@solana/wallet-adapter-react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';
import { Transaction } from '@solana/web3.js';
import { createProposal, InstructionDataWithHoldUpTime } from '../actions/createProposal';
import { PublicKey, TransactionInstruction, Connection } from '@solana/web3.js'
import { Vote, VoteChoice, VoteKind, withCastVote } from '@solana/spl-governance'

const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const Home: NextPage = () => {
    const { sendTransaction, publicKey } = useWallet()
    const [label, setLabel] = useState('Submit Transaction')
    const submitTransaction = async () => {
        if (!publicKey) return;
        setLabel('Submitting Transaction...')
        const newTransaction = new Transaction();
        const connection = new Connection('https://solana-api.syndica.io/access-token/9JBqce4qfAURlDgD4vgOvDF3uqvvDPpq3j38ZvEvSypc8p0PcZ9KMcqWWb6yXrTI/rpc', 'confirmed');
        const serializedProposalInstruction = '6uQ1ve51tzTNWT7PmjBLgCS6KJhnt2mx+Tynu7iORv4BAAAAc999/jcNa8ku376tfjhCCZ9basdqxQ+87SGcjSsqktABAScAAAATADwAEKXU6AAAAAAAAACA9AMAAAA8ADwBAAAAAAAAAAACAAAAAAo='
        const proposalInstructionData = new InstructionDataWithHoldUpTime({
            governance: undefined,
            instruction: serializedProposalInstruction
        })
        const { proposalInstructions, proposalAddress } = await createProposal(
            new PublicKey('5vAePzYrFQgtcCf9vgxfesuGKtXrVmsyc3QAA7maSMpM'),
            publicKey,
            new PublicKey('86yaj9ZafwmjMsdBh8S7u79wApY3zBwqs3jVP9cAAGos'),
            new PublicKey('Hwgfzm6A9MxBYTK4kWJtwpAG45ezefc4uUZ5EsXFrMXg'),
            'Change Governance Config',
            '',
            new PublicKey('DnfFn1WRrANrcUvXmgrYZzPyUkGXgcmji8aWC3H6pS2R'),
            0,
            [proposalInstructionData],
        )
        const vote = new Vote({
            voteType: VoteKind.Approve,
            approveChoices: [new VoteChoice({ rank: 0, weightPercentage: 100 })],
            deny: undefined,
            veto: undefined,
        })

        console.log(proposalInstructions)

        await withCastVote(
            proposalInstructions,
            new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw'),
            3,
            new PublicKey('5vAePzYrFQgtcCf9vgxfesuGKtXrVmsyc3QAA7maSMpM'),
            new PublicKey('86yaj9ZafwmjMsdBh8S7u79wApY3zBwqs3jVP9cAAGos'),
            proposalAddress,
            new PublicKey('Hwgfzm6A9MxBYTK4kWJtwpAG45ezefc4uUZ5EsXFrMXg'),
            new PublicKey('Hwgfzm6A9MxBYTK4kWJtwpAG45ezefc4uUZ5EsXFrMXg'),
            publicKey,
            new PublicKey('DnfFn1WRrANrcUvXmgrYZzPyUkGXgcmji8aWC3H6pS2R'),
            vote,
            publicKey,
            undefined,
            undefined,
        )

        await withCastVote(
            proposalInstructions,
            new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw'),
            3,
            new PublicKey('5vAePzYrFQgtcCf9vgxfesuGKtXrVmsyc3QAA7maSMpM'),
            new PublicKey('86yaj9ZafwmjMsdBh8S7u79wApY3zBwqs3jVP9cAAGos'),
            proposalAddress,
            new PublicKey('Hwgfzm6A9MxBYTK4kWJtwpAG45ezefc4uUZ5EsXFrMXg'),
            new PublicKey('ELRCgd2m383WUkynVWiCxAHr85fnEAMP7var5oNyi4jB'),
            publicKey,
            new PublicKey('DnfFn1WRrANrcUvXmgrYZzPyUkGXgcmji8aWC3H6pS2R'),
            vote,
            publicKey,
            undefined,
            undefined,
        )


        // 5yqwy...
        // await withCastVote(
        //     proposalInstructions,
        //     new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw'),
        //     3,
        //     new PublicKey('5vAePzYrFQgtcCf9vgxfesuGKtXrVmsyc3QAA7maSMpM'),
        //     new PublicKey('8oKYV7zrqjaPZkBDaBkuKKzPa9cFSsiKMiSbh18QAEN3'),
        //     proposalAddress,
        //     new PublicKey('ELRCgd2m383WUkynVWiCxAHr85fnEAMP7var5oNyi4jB'),
        //     new PublicKey('Cm5mhGARCRQdqK5scZrdymtwW6D94qmmzwzJ6Lyin4G4'),
        //     publicKey,
        //     new PublicKey('DnfFn1WRrANrcUvXmgrYZzPyUkGXgcmji8aWC3H6pS2R'),
        //     vote,
        //     publicKey,
        //     undefined,
        //     undefined,
        // )

        console.log(proposalInstructions)
        newTransaction.instructions = proposalInstructions.map((instruction: TransactionInstruction) => {
            return instruction
        })

        const tx = await sendTransaction(newTransaction, connection, { skipPreflight: true, })
        console.log(tx)
        setLabel('Transaction submitted')
        window.open(`https://explorer.solana.com/tx/${tx}`, '_blank')
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>NATION - TimberDAO</title>
                <meta name="description" content="custom proposal frontend for TIMBERDAO" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Custom <a href="https://nation.io">NATION</a> frontend for TIMBERDAO
                </h1>

                <div className={styles.walletButtons}>
                    <WalletMultiButtonDynamic className='bg-purple-800' />
                    <WalletDisconnectButtonDynamic className='bg-gray-800' />
                </div>


                <button
                    onClick={submitTransaction}
                    className="rounded-md bg-purple-600 px-2.5 py-1 text-white mt-20"
                >
                    Submit transaction
                </button>
                <p><em>Note:</em> This transaction will create the proposal to change the governance config and then vote on it immediately with your council tokens.</p>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://nation.io/learn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{'NATION'}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    );
};

export default Home;
