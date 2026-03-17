export interface UserPairingPayload {
  roomId: string;
  isInitiator: boolean;
  remoteUsername: string;
}

export interface OfferPayload {
  offer: RTCSessionDescriptionInit;
  roomId: string;
}

export interface AnswerPayload {
  answer: RTCSessionDescriptionInit;
  roomId: string;
}

export interface IceCandidatePayload {
  candidate: RTCIceCandidateInit;
  roomId: string;
}

export interface ChatMessagePayload {
  message: string;
  roomId: string;
}

export interface ServerToClientEvents {
  "user-paired": (payload: UserPairingPayload) => void;
  "user-disconnected": () => void;
  "receive-offer": (payload: OfferPayload) => void;
  "receive-answer": (payload: AnswerPayload) => void;
  "receive-ice-candidate": (payload: IceCandidatePayload) => void;
  "receive-chat-message": (payload: ChatMessagePayload) => void;
  "online-users-count": (payload: { count: number }) => void;
}

export interface ClientToServerEvents {
  "join-queue": () => void;
  "leave-queue": () => void;
  "send-offer": (payload: OfferPayload) => void;
  "send-answer": (payload: AnswerPayload) => void;
  "send-ice-candidate": (payload: IceCandidatePayload) => void;
  "send-chat-message": (payload: ChatMessagePayload) => void;
  "next-user": () => void;
}
