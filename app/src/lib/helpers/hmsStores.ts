import type { HMSStore } from '@100mslive/hms-video-store'
import type { Readable } from 'svelte/store'
import { readable, writable } from 'svelte/store'
import { hmsStore } from './hms'
import {
	selectDevices,
	selectHMSMessages,
	selectIsConnectedToRoom,
	selectIsLocalAudioEnabled,
	selectIsLocalScreenShared,
	selectIsLocalVideoEnabled,
	selectIsSomeoneScreenSharing,
	selectLocalMediaSettings,
	selectPeers,
	selectPeerScreenSharing,
	selectLocalPeer,
	selectLocalPeerID,
	selectIsPeerAudioEnabled
} from '@100mslive/hms-video-store'

export const tokenStore = writable()

function hmsToSvelteStore<T>(selector: (store: HMSStore) => T): Readable<T> {
	return readable(hmsStore.getState(selector), (set) => {
		return hmsStore.subscribe(set, selector)
	})
}

export const hmsIsConnected = hmsToSvelteStore(selectIsConnectedToRoom)
export const hmsPeers = hmsToSvelteStore(selectPeers)
export const hmsLocalPeer = hmsToSvelteStore(selectLocalPeer)
export const hmsLocalPeerID = hmsToSvelteStore(selectLocalPeerID)
export const hmsIsAudioEnabled = hmsToSvelteStore(selectIsLocalAudioEnabled)
export const hmsIsVideoEnabled = hmsToSvelteStore(selectIsLocalVideoEnabled)
export const hmsMessages = hmsToSvelteStore(selectHMSMessages)

// For knowing list of audio and video devices as well as the currently selected ones
export const hmsAllDevices = hmsToSvelteStore(selectDevices)
export const hmsSelectedDevices = hmsToSvelteStore(selectLocalMediaSettings)

// UI things
export const isChatOpen = writable(false)

// Screenshare related
export const hmsAmIScreenSharing = hmsToSvelteStore(selectIsLocalScreenShared)
export const hmsIsAnyoneScreenSharing = hmsToSvelteStore(selectIsSomeoneScreenSharing)
export const hmsPeerScreenSharing = hmsToSvelteStore(selectPeerScreenSharing)
