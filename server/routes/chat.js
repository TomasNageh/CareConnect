import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  messages,
  getUserDisplayName,
  getUserRole,
  nextId,
} from '../data/store.js';

const router = Router();

router.get('/history/:otherUserId', authRequired('Patient', 'Doctor'), (req, res) => {
  const otherUserId = Number(req.params.otherUserId);
  const userId = req.auth.userId;

  const history = messages
    .filter(
      (m) =>
        (m.senderId === userId && m.receiverId === otherUserId) ||
        (m.senderId === otherUserId && m.receiverId === userId)
    )
    .map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: getUserDisplayName(m.senderId),
      senderRole: getUserRole(m.senderId),
      receiverId: m.receiverId,
      receiverName: getUserDisplayName(m.receiverId),
      receiverRole: getUserRole(m.receiverId),
      message: m.message,
      sentAt: m.sentAt,
      isRead: m.isRead,
    }))
    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

  res.json(history);
});

router.get('/conversations', authRequired('Patient', 'Doctor'), (req, res) => {
  const userId = req.auth.userId;
  const partnerIds = new Set();

  messages.forEach((m) => {
    if (m.senderId === userId) partnerIds.add(m.receiverId);
    if (m.receiverId === userId) partnerIds.add(m.senderId);
  });

  const conversations = [...partnerIds].map((otherUserId) => {
    const thread = messages.filter(
      (m) =>
        (m.senderId === userId && m.receiverId === otherUserId) ||
        (m.senderId === otherUserId && m.receiverId === userId)
    );
    const last = thread.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))[0];

    return {
      otherUserId,
      otherUserName: getUserDisplayName(otherUserId),
      otherUserRole: getUserRole(otherUserId),
      lastMessage: last?.message || null,
      lastMessageTime: last?.sentAt || null,
      unreadCount: thread.filter((m) => m.receiverId === userId && !m.isRead).length,
    };
  });

  conversations.sort((a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0));
  res.json(conversations);
});

router.post('/send', authRequired('Patient', 'Doctor'), (req, res) => {
  const { receiverId, message } = req.body;
  const msg = {
    id: nextId('message'),
    senderId: req.auth.userId,
    receiverId,
    message,
    sentAt: new Date().toISOString(),
    isRead: false,
  };
  messages.push(msg);

  res.json({
    id: msg.id,
    senderId: msg.senderId,
    senderName: getUserDisplayName(msg.senderId),
    receiverId: msg.receiverId,
    receiverName: getUserDisplayName(msg.receiverId),
    message: msg.message,
    sentAt: msg.sentAt,
    isRead: msg.isRead,
  });
});

export default router;
