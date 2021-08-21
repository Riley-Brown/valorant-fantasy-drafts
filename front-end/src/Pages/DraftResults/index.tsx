import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import {
    getLiveDraftResults,
    liveDraftResultsEventsUrl,
    getLiveDraftStreams,
} from 'API';
import SelectedRoster from 'Pages/ClosestUpcomingDraft/SelectedRoster';
import { calcUnixTimeDifference } from 'Helpers';
import { useTypedSelector } from 'Reducers';

export default function DraftResults() {
    const params = useParams<{ draftId: string }>();

    const account = useTypedSelector((state) => state.account);
    const [isUserEntered, setIsUserEntered] = useState(false);

    const [draftLivestreams, setDraftLivesteams] = useState({
        dataArray: [],
        rawData: {},
    });

    useEffect(() => {
        getLiveDraftStreams(params.draftId).then(({ data }) => {
            setDraftLivesteams({
                rawData: data.streams,
                dataArray: Object.values(data.streams),
            });
        });
    }, [params.draftId]);

    useEffect(() => {
        const findDraft = account.drafts.find(
            (draft) => draft.draftId === params.draftId
        );

        if (findDraft) {
            setIsUserEntered(true);
        }
    }, [account.drafts, params.draftId]);

    const [lastUpdated, setLastUpdated] = useState<number>();
    const [participantsScores, setParticipantsScores] = useState<any[]>();
    const [playerMatches, setPlayerMatches] = useState<any[]>();
    const [playerMatchesRaw, setPlayerMatchesRaw] = useState<{
        [key: string]: any;
    }>();
    const [players, setPlayers] = useState<{
        [key: string]: {
            avatarUrl: string;
            elo: number;
            iconUrl: string;
            id: string;
            pictureUrl: string;
            platformUserHandle: string;
            rank: number;
            userHandleOnly: string;
            wins: number;
        };
    }>();

    useEffect(() => {
        const events = new EventSource(
            liveDraftResultsEventsUrl(params.draftId)
        );

        events.addEventListener('message', (message) => {
            // console.log(message);
            const { participantsScores, playerMatches, lastUpdated, players } =
                JSON.parse(message.data);

            console.log(JSON.parse(message.data));

            setParticipantsScores(participantsScores);

            setPlayerMatchesRaw(playerMatches);

            setPlayerMatches(handleFormatPlayerMatches(playerMatches));
            setLastUpdated(lastUpdated);
            setPlayers(players);
        });

        getLiveDraftResults(params.draftId).then((res) => {
            if (!res.data) return;

            setParticipantsScores(res.data.participantsScores);

            const playerMatches = handleFormatPlayerMatches(
                res.data.playerMatches
            );

            console.log(playerMatches);

            setPlayerMatchesRaw(res.data.playerMatches);
            setPlayerMatches(playerMatches);
            setLastUpdated(res.lastUpdated);
            setPlayers(res.data.players);

            const currentTime = Math.floor(Date.now() / 1000);
            const { minutes, seconds } = calcUnixTimeDifference(
                currentTime,
                res.lastUpdated
            );

            setLastUpdatedFormatted({ minutes, seconds });
        });
    }, []);

    const lastUpdatedIntervalRef = useRef<any>();

    const [lastUpdatedFormatted, setLastUpdatedFormatted] = useState<{
        minutes: number;
        seconds: number;
    }>();

    useEffect(() => {
        const handleLastUpdated = () => {
            const currentTime = Date.now() / 1000;
            const { minutes, seconds } = calcUnixTimeDifference(
                currentTime,
                lastUpdated as number
            );

            setLastUpdatedFormatted({ minutes, seconds });
        };

        if (lastUpdated) {
            handleLastUpdated();
            lastUpdatedIntervalRef.current = setInterval(
                handleLastUpdated,
                5000
            );
        }

        return () => {
            clearInterval(lastUpdatedIntervalRef.current);
        };
    }, [lastUpdated]);

    const handleFormatPlayerMatches = (playerMatches: any) => {
        return (playerMatches = Object.keys(playerMatches)
            .map((key) => ({ ...playerMatches[key], id: key }))
            .sort((a: any, b: any) => b.totalScore - a.totalScore));
    };

    return (
        <>
            {draftLivestreams.dataArray?.length > 0 &&
                draftLivestreams.dataArray.map((stream) => (
                    <>
                        <iframe
                            // @ts-ignore
                            src={`https://player.twitch.tv/?channel=${stream.channelName}&parent=localhost`}
                            height="400"
                            width="500"
                            // @ts-ignore
                            allowfullscreen="true"
                        ></iframe>
                    </>
                ))}
            <div
                style={{
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 50,
                }}
            >
                {players && playerMatches && (
                    <div style={{ marginRight: 200 }}>
                        <h1>Best performing players</h1>
                        {lastUpdated && (
                            <h4 style={{ marginBottom: 20 }}>
                                Last updated: {lastUpdatedFormatted?.minutes}{' '}
                                minutes {lastUpdatedFormatted?.seconds} seconds
                            </h4>
                        )}
                        {playerMatches.map((player) => (
                            <div style={{ marginBottom: 20 }}>
                                <h2>{players[player.id]?.userHandleOnly}</h2>
                                <img
                                    style={{
                                        maxHeight: 128,
                                        width: 128,
                                        objectFit: 'cover',
                                    }}
                                    src={players[player.id]?.avatarUrl}
                                    alt=""
                                />
                                <h4>Rank: {players[player.id]?.rank}</h4>
                                <h4>
                                    Total score:{' '}
                                    {player.totalScore.toLocaleString()}
                                </h4>
                                <h4>Kills: {player.totalKills}</h4>
                                <h4>Deaths: {player.totalDeaths}</h4>
                                <h4>Rounds won: {player.totalRoundsWon}</h4>
                                <h4>Rounds lost: {player.totalRoundsLost}</h4>
                                <h4>Assists: {player.totalAssists}</h4>
                            </div>
                        ))}
                    </div>
                )}
                {participantsScores && (
                    <div>
                        <h1 style={{ marginBottom: 20 }}>
                            Best performing users
                        </h1>
                        {participantsScores.map((participant: any, index) => (
                            <div style={{ marginBottom: 50 }}>
                                <h2>{participant.displayName}</h2>
                                <h4 style={{ marginBottom: 10 }}>
                                    Total score:{' '}
                                    {participant.totalScore.toLocaleString()}
                                </h4>
                                {participant.selectedRoster.map(
                                    (player: any) => (
                                        <div style={{ marginBottom: 20 }}>
                                            <h2>{player.userHandleOnly}</h2>
                                            <img
                                                src={player.avatarUrl}
                                                alt=""
                                            />
                                            <h4>Rank: {player.rank}</h4>
                                            <h4>Elo: {player.elo}</h4>
                                            <h4>
                                                Score:{' '}
                                                {playerMatchesRaw &&
                                                    playerMatchesRaw[
                                                        player.id
                                                    ]?.totalScore.toLocaleString()}
                                            </h4>
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
