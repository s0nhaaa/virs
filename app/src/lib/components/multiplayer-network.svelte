<script lang="ts">
	import { hmsIsConnected, hmsLocalPeerID } from '$lib/helpers'
	import { characterConfig, nearestPlayers, networking, otherPlayers } from '$lib/stores'
	import { Client } from 'colyseus.js'
	import { omit } from 'lodash-es'

	let client = new Client('wss://virs.clasrum.fun')

	const joinRoom = async () => {
		try {
			const room = await client.joinOrCreate('world', {
				peerID: $hmsLocalPeerID,
				characterConfig: $characterConfig
			})
			room.state.players.onAdd = (player, sessionId: string) => {
				sessionId !== room.sessionId &&
					otherPlayers.update((other) => ({
						...other,
						[`${player.id}`]: {
							peerID: player.peerID,
							position: {
								x: player.position.x,
								y: player.position.y,
								z: player.position.z
							},
							quaternion: {
								x: player.quaternion.x,
								y: player.quaternion.y,
								z: player.quaternion.z,
								w: player.quaternion.w
							},
							action: player.action,
							characterConfig: {
								hair: player.characterConfig.hair,
								upper: player.characterConfig.upper,
								lower: player.characterConfig.lower,
								shoe: player.characterConfig.shoe
							}
						}
					}))

				player.onChange = function () {
					if (sessionId !== room.sessionId) {
						otherPlayers.update((other) => ({
							...other,
							[`${player.id}`]: {
								peerID: player.peerID,
								position: {
									x: player.position.x,
									y: player.position.y,
									z: player.position.z
								},
								quaternion: {
									x: player.quaternion.x,
									y: player.quaternion.y,
									z: player.quaternion.z,
									w: player.quaternion.w
								},
								action: player.action,
								characterConfig: {
									hair: player.characterConfig.hair,
									upper: player.characterConfig.upper,
									lower: player.characterConfig.lower,
									shoe: player.characterConfig.shoe
								}
							}
						}))
					}
				}
			}

			room.state.players.onRemove = (player, sessionId: string) => {
				otherPlayers.update((other) => omit(other, sessionId))
				nearestPlayers.update((nP) => nP.filter((p) => p !== player.peerID))
			}

			networking.set(room)
		} catch (e) {
			console.error('join error', e)
		}
	}
</script>

{#if $hmsIsConnected && $hmsLocalPeerID && $characterConfig}
	{#await joinRoom()}{/await}
{/if}
