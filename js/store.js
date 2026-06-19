/**
 * 中年相亲网 - 数据存储层
 * 使用 localStorage 实现数据持久化
 * 所有用户界面文本使用中文
 */
(function () {
  'use strict';

  // localStorage 键名常量
  var KEYS = {
    users: 'dating_app_users',
    profiles: 'dating_app_profiles',
    messages: 'dating_app_messages',
    matches: 'dating_app_matches',
    groups: 'dating_app_groups',
    events: 'dating_app_events',
    stories: 'dating_app_stories',
    currentUser: 'dating_app_currentUser',
    fontScale: 'dating_app_fontScale',
    blockedUsers: 'dating_app_blockedUsers',
    privacySettings: 'dating_app_privacySettings'
  };

  // =========================================================================
  // 内部辅助方法
  // =========================================================================

  function _getAll(key) {
    return storageGet(key, []);
  }

  function _setAll(key, data) {
    return storageSet(key, data);
  }

  function _findById(arr, id) {
    if (!Array.isArray(arr) || !id) return null;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) return arr[i];
    }
    return null;
  }

  function _findIndexById(arr, id) {
    if (!Array.isArray(arr) || !id) return -1;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) return i;
    }
    return -1;
  }

  // =========================================================================
  // Store 对象
  // =========================================================================

  var Store = {
    // =========================================================================
    // 用户操作
    // =========================================================================

    /**
     * 获取所有用户
     * @returns {Array}
     */
    getUsers: function () {
      return _getAll(KEYS.users);
    },

    /**
     * 根据ID获取用户
     * @param {string} id
     * @returns {Object|null}
     */
    getUserById: function (id) {
      if (!id) return null;
      return _findById(_getAll(KEYS.users), id);
    },

    /**
     * 根据邮箱获取用户
     * @param {string} email
     * @returns {Object|null}
     */
    getUserByEmail: function (email) {
      if (!email) return null;
      var users = _getAll(KEYS.users);
      var emailLower = email.toLowerCase().trim();
      for (var i = 0; i < users.length; i++) {
        if (users[i].email && users[i].email.toLowerCase().trim() === emailLower) {
          return users[i];
        }
      }
      return null;
    },

    /**
     * 根据手机号获取用户
     * @param {string} phone
     * @returns {Object|null}
     */
    getUserByPhone: function (phone) {
      if (!phone) return null;
      var users = _getAll(KEYS.users);
      for (var i = 0; i < users.length; i++) {
        if (users[i].phone && users[i].phone.trim() === phone.trim()) {
          return users[i];
        }
      }
      return null;
    },

    /**
     * 添加用户
     * @param {Object} user - 用户对象
     * @returns {Object} 创建的用户（含生成的ID和时间戳）
     */
    addUser: function (user) {
      if (!user || typeof user !== 'object') {
        console.error('addUser: invalid user object');
        return null;
      }
      var users = _getAll(KEYS.users);
      var now = nowISO();
      var newUser = {
        id: generateId('u'),
        email: user.email || '',
        phone: user.phone || '',
        password: user.password || '',
        name: user.name || '',
        gender: user.gender || '',
        birthDate: user.birthDate || '',
        location: user.location || {},
        isVerified: user.isVerified || false,
        isVip: user.isVip || false,
        avatar: user.avatar || '',
        role: user.role || 'user',
        status: 'active',
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null
      };
      users.push(newUser);
      _setAll(KEYS.users, users);
      return newUser;
    },

    /**
     * 更新用户信息
     * @param {string} id - 用户ID
     * @param {Object} updates - 要更新的字段
     * @returns {Object|null} 更新后的用户
     */
    updateUser: function (id, updates) {
      if (!id || !updates) return null;
      var users = _getAll(KEYS.users);
      var index = _findIndexById(users, id);
      if (index === -1) return null;
      // 不更新 id, createdAt
      var forbidden = ['id', 'createdAt'];
      for (var key in updates) {
        if (updates.hasOwnProperty(key) && forbidden.indexOf(key) === -1) {
          users[index][key] = updates[key];
        }
      }
      users[index].updatedAt = nowISO();
      _setAll(KEYS.users, users);
      return users[index];
    },

    // =========================================================================
    // 个人资料操作
    // =========================================================================

    /**
     * 获取用户的个人资料
     * @param {string} userId
     * @returns {Object|null}
     */
    getProfile: function (userId) {
      if (!userId) return null;
      var profiles = _getAll(KEYS.profiles);
      for (var i = 0; i < profiles.length; i++) {
        if (profiles[i].userId === userId) return profiles[i];
      }
      return null;
    },

    /**
     * 创建个人资料
     * @param {Object} profile - 资料对象（必须包含userId）
     * @returns {Object|null}
     */
    createProfile: function (profile) {
      if (!profile || !profile.userId) {
        console.error('createProfile: userId is required');
        return null;
      }
      // 检查是否已存在
      var existing = this.getProfile(profile.userId);
      if (existing) {
        console.warn('createProfile: profile already exists for userId=' + profile.userId);
        return existing;
      }
      var profiles = _getAll(KEYS.profiles);
      var now = nowISO();
      var newProfile = {
        id: generateId('prf'),
        userId: profile.userId,
        height: profile.height || null,
        weight: profile.weight || null,
        education: profile.education || '',
        occupation: profile.occupation || '',
        income: profile.income || '',
        incomeRange: profile.incomeRange || '',
        maritalStatus: profile.maritalStatus || '',
        hasChildren: profile.hasChildren || false,
        childrenDetails: profile.childrenDetails || '',
        hobbies: profile.hobbies || [],
        personality: profile.personality || [],
        selfIntro: profile.selfIntro || '',
        photos: profile.photos || [],
        partnerAgeMin: profile.partnerAgeMin || null,
        partnerAgeMax: profile.partnerAgeMax || null,
        partnerEducation: profile.partnerEducation || '',
        partnerIncome: profile.partnerIncome || '',
        partnerRequirements: profile.partnerRequirements || '',
        partnerMaritalPref: profile.partnerMaritalPref || '',
        verificationStatus: 'unverified',
        createdAt: now,
        updatedAt: now
      };
      profiles.push(newProfile);
      _setAll(KEYS.profiles, profiles);
      return newProfile;
    },

    /**
     * 更新个人资料
     * @param {string} userId
     * @param {Object} updates
     * @returns {Object|null}
     */
    updateProfile: function (userId, updates) {
      if (!userId || !updates) return null;
      var profiles = _getAll(KEYS.profiles);
      var index = -1;
      for (var i = 0; i < profiles.length; i++) {
        if (profiles[i].userId === userId) {
          index = i;
          break;
        }
      }
      if (index === -1) return null;
      var forbidden = ['id', 'userId', 'createdAt'];
      for (var key in updates) {
        if (updates.hasOwnProperty(key) && forbidden.indexOf(key) === -1) {
          profiles[index][key] = updates[key];
        }
      }
      profiles[index].updatedAt = nowISO();
      _setAll(KEYS.profiles, profiles);
      return profiles[index];
    },

    /**
     * 获取所有资料（连接用户信息）
     * @returns {Array}
     */
    getAllProfiles: function () {
      var users = _getAll(KEYS.users);
      var profiles = _getAll(KEYS.profiles);
      var result = [];
      for (var i = 0; i < profiles.length; i++) {
        var profile = profiles[i];
        var user = null;
        for (var j = 0; j < users.length; j++) {
          if (users[j].id === profile.userId) {
            user = users[j];
            break;
          }
        }
        if (user && user.status === 'active') {
          var joined = Object.assign({}, profile, {
            name: user.name,
            gender: user.gender,
            age: calculateAge(user.birthDate),
            birthDate: user.birthDate,
            location: user.location,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            isVerified: user.isVerified,
            isVip: user.isVip
          });
          result.push(joined);
        }
      }
      return result;
    },

    // =========================================================================
    // 身份验证
    // =========================================================================

    /**
     * 登录
     * @param {string} emailOrPhone - 邮箱或手机号
     * @param {string} password - 密码
     * @returns {{ success: boolean, user: Object|null, message: string }}
     */
    login: function (emailOrPhone, password) {
      if (!emailOrPhone || !password) {
        return { success: false, user: null, message: '请输入账号和密码' };
      }
      var users = _getAll(KEYS.users);
      var user = null;
      var input = emailOrPhone.trim();
      // 判断是邮箱还是手机号
      if (input.indexOf('@') !== -1) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].email && users[i].email.toLowerCase().trim() === input.toLowerCase()) {
            user = users[i];
            break;
          }
        }
      } else {
        for (var j = 0; j < users.length; j++) {
          if (users[j].phone && users[j].phone.trim() === input) {
            user = users[j];
            break;
          }
        }
      }
      if (!user) {
        return { success: false, user: null, message: '账号不存在，请先注册' };
      }
      if (user.status === 'blocked') {
        return { success: false, user: null, message: '该账号已被禁用，请联系客服' };
      }
      var hashedInput = simpleHash(password);
      if (user.password !== hashedInput) {
        return { success: false, user: null, message: '密码错误，请重试' };
      }
      // 更新最后登录时间
      this.updateUser(user.id, { lastLoginAt: nowISO() });
      user = this.getUserById(user.id);
      storageSet(KEYS.currentUser, user);
      return { success: true, user: user, message: '登录成功' };
    },

    /**
     * 注册新用户
     * @param {Object} userData - 用户数据
     *   { name, gender, birthDate, phone, email, password, location,
     *     height, weight, education, occupation, income, maritalStatus,
     *     hasChildren, hobbies, selfIntro, personality,
     *     partnerAgeMin, partnerAgeMax, partnerEducation, partnerIncome,
     *     partnerRequirements, avatar }
     * @returns {{ success: boolean, user: Object|null, message: string }}
     */
    register: function (userData) {
      if (!userData || typeof userData !== 'object') {
        return { success: false, user: null, message: '注册数据无效' };
      }
      // 检查邮箱是否已注册
      if (userData.email && this.getUserByEmail(userData.email)) {
        return { success: false, user: null, message: '该邮箱已被注册' };
      }
      // 检查手机号是否已注册
      if (userData.phone && this.getUserByPhone(userData.phone)) {
        return { success: false, user: null, message: '该手机号已被注册' };
      }
      // 创建用户
      var hashedPassword = simpleHash(userData.password);
      var userObj = {
        email: userData.email || '',
        phone: userData.phone || '',
        password: hashedPassword,
        name: userData.name || '',
        gender: userData.gender || '',
        birthDate: userData.birthDate || '',
        location: userData.location || { province: '', city: '', district: '' },
        isVerified: false,
        isVip: false,
        avatar: userData.avatar || '',
        role: 'user'
      };
      var newUser = this.addUser(userObj);
      if (!newUser) {
        return { success: false, user: null, message: '创建用户失败，请重试' };
      }
      // 创建资料
      var profileData = {
        userId: newUser.id,
        height: userData.height || null,
        weight: userData.weight || null,
        education: userData.education || '',
        occupation: userData.occupation || '',
        income: userData.income || '',
        incomeRange: userData.incomeRange || '',
        maritalStatus: userData.maritalStatus || '',
        hasChildren: userData.hasChildren || false,
        childrenDetails: userData.childrenDetails || '',
        hobbies: userData.hobbies || [],
        personality: userData.personality || [],
        selfIntro: userData.selfIntro || '',
        photos: userData.photos || [],
        partnerAgeMin: userData.partnerAgeMin || null,
        partnerAgeMax: userData.partnerAgeMax || null,
        partnerEducation: userData.partnerEducation || '',
        partnerIncome: userData.partnerIncome || '',
        partnerRequirements: userData.partnerRequirements || '',
        partnerMaritalPref: userData.partnerMaritalPref || ''
      };
      this.createProfile(profileData);
      // 登录新用户
      storageSet(KEYS.currentUser, newUser);
      return { success: true, user: newUser, message: '注册成功！欢迎加入中年相亲网' };
    },

    /**
     * 退出登录
     */
    logout: function () {
      storageRemove(KEYS.currentUser);
    },

    /**
     * 获取当前登录用户
     * @returns {Object|null}
     */
    getCurrentUser: function () {
      return storageGet(KEYS.currentUser, null);
    },

    /**
     * 检查是否已登录
     * @returns {boolean}
     */
    isLoggedIn: function () {
      var user = storageGet(KEYS.currentUser, null);
      return user !== null && user.id !== undefined;
    },

    // =========================================================================
    // 匹配操作
    // =========================================================================

    /**
     * 获取用户的所有匹配
     * @param {string} userId
     * @returns {Array}
     */
    getMatches: function (userId) {
      if (!userId) return [];
      var matches = _getAll(KEYS.matches);
      return matches.filter(function (m) {
        return m.userId === userId || m.targetUserId === userId;
      });
    },

    /**
     * 创建匹配记录
     * @param {string} userId
     * @param {string} targetUserId
     * @param {number} score - 匹配分数
     * @param {string} type - 匹配类型
     * @returns {Object|null}
     */
    createMatch: function (userId, targetUserId, score, type) {
      if (!userId || !targetUserId) return null;
      var matches = _getAll(KEYS.matches);
      // 防止重复
      for (var i = 0; i < matches.length; i++) {
        if ((matches[i].userId === userId && matches[i].targetUserId === targetUserId) ||
            (matches[i].userId === targetUserId && matches[i].targetUserId === userId)) {
          // 更新分数
          matches[i].score = score || matches[i].score;
          matches[i].updatedAt = nowISO();
          _setAll(KEYS.matches, matches);
          return matches[i];
        }
      }
      var now = nowISO();
      var match = {
        id: generateId('mtc'),
        userId: userId,
        targetUserId: targetUserId,
        score: score || 0,
        type: type || 'system',
        status: 'pending',
        createdAt: now,
        updatedAt: now
      };
      matches.push(match);
      _setAll(KEYS.matches, matches);
      return match;
    },

    /**
     * 记录一个"喜欢"
     * @param {string} userId - 当前用户ID
     * @param {string} targetUserId - 目标用户ID
     * @returns {{ matched: boolean, match: Object|null }}
     */
    likeUser: function (userId, targetUserId) {
      if (!userId || !targetUserId) return { matched: false, match: null };
      var matches = _getAll(KEYS.matches);
      var now = nowISO();
      // 检查对方是否已经喜欢了我
      var mutualMatch = null;
      for (var i = 0; i < matches.length; i++) {
        if (matches[i].userId === targetUserId &&
            matches[i].targetUserId === userId &&
            matches[i].type === 'like') {
          // 双向喜欢 - 创建匹配
          matches[i].status = 'matched';
          matches[i].updatedAt = now;
          mutualMatch = matches[i];
          break;
        }
      }
      if (mutualMatch) {
        _setAll(KEYS.matches, matches);
        return { matched: true, match: mutualMatch };
      }
      // 否则创建单向喜欢记录
      var like = {
        id: generateId('lik'),
        userId: userId,
        targetUserId: targetUserId,
        score: 0,
        type: 'like',
        status: 'pending',
        createdAt: now,
        updatedAt: now
      };
      matches.push(like);
      _setAll(KEYS.matches, matches);
      return { matched: false, match: like };
    },

    /**
     * 获取双向匹配（已经互相喜欢）
     * @param {string} userId
     * @returns {Array}
     */
    getMutualMatches: function (userId) {
      if (!userId) return [];
      var matches = _getAll(KEYS.matches);
      var mutualIds = {};
      var result = [];
      for (var i = 0; i < matches.length; i++) {
        var m = matches[i];
        if (m.status === 'matched' && (m.userId === userId || m.targetUserId === userId)) {
          var partnerId = m.userId === userId ? m.targetUserId : m.userId;
          if (!mutualIds[partnerId]) {
            mutualIds[partnerId] = true;
            result.push({
              match: m,
              partner: this.getUserById(partnerId),
              profile: this.getProfile(partnerId)
            });
          }
        }
      }
      return result;
    },

    /**
     * 获取用户被谁喜欢了
     * @param {string} userId
     * @returns {Array}
     */
    getLikesReceived: function (userId) {
      if (!userId) return [];
      var matches = _getAll(KEYS.matches);
      return matches.filter(function (m) {
        return m.targetUserId === userId && m.type === 'like' && m.status === 'pending';
      });
    },

    // =========================================================================
    // 消息操作
    // =========================================================================

    /**
     * 获取两个用户之间的消息记录
     * @param {string} userId
     * @param {string} partnerId
     * @returns {Array}
     */
    getMessages: function (userId, partnerId) {
      if (!userId || !partnerId) return [];
      var messages = _getAll(KEYS.messages);
      return messages.filter(function (msg) {
        return (msg.senderId === userId && msg.receiverId === partnerId) ||
               (msg.senderId === partnerId && msg.receiverId === userId);
      }).sort(function (a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    },

    /**
     * 发送消息
     * @param {string} senderId
     * @param {string} receiverId
     * @param {string} content - 消息内容
     * @param {string} type - 消息类型: 'text', 'image', 'system'
     * @returns {Object|null}
     */
    sendMessage: function (senderId, receiverId, content, type) {
      if (!senderId || !receiverId || !content) return null;
      var messages = _getAll(KEYS.messages);
      var now = nowISO();
      var msg = {
        id: generateId('msg'),
        senderId: senderId,
        receiverId: receiverId,
        content: content,
        type: type || 'text',
        isRead: false,
        readAt: null,
        createdAt: now
      };
      messages.push(msg);
      _setAll(KEYS.messages, messages);
      return msg;
    },

    /**
     * 获取用户的所有会话列表
     * @param {string} userId
     * @returns {Array} 会话列表，每条包含最后一条消息和对方用户信息
     */
    getConversations: function (userId) {
      if (!userId) return [];
      var messages = _getAll(KEYS.messages);
      var conversations = {};
      for (var i = 0; i < messages.length; i++) {
        var msg = messages[i];
        if (msg.senderId !== userId && msg.receiverId !== userId) continue;
        var partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        if (!conversations[partnerId]) {
          conversations[partnerId] = {
            partnerId: partnerId,
            partner: this.getUserById(partnerId),
            profile: this.getProfile(partnerId),
            lastMessage: msg,
            unreadCount: 0,
            messages: []
          };
        }
        conversations[partnerId].messages.push(msg);
        // 更新最后一条消息
        if (!conversations[partnerId].lastMessage ||
            new Date(msg.createdAt) > new Date(conversations[partnerId].lastMessage.createdAt)) {
          conversations[partnerId].lastMessage = msg;
        }
        // 统计未读
        if (msg.receiverId === userId && !msg.isRead) {
          conversations[partnerId].unreadCount++;
        }
      }
      // 按最后消息时间排序
      var result = [];
      for (var key in conversations) {
        if (conversations.hasOwnProperty(key)) {
          result.push(conversations[key]);
        }
      }
      result.sort(function (a, b) {
        return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
      });
      return result;
    },

    /**
     * 获取未读消息总数
     * @param {string} userId
     * @returns {number}
     */
    getUnreadCount: function (userId) {
      if (!userId) return 0;
      var messages = _getAll(KEYS.messages);
      var count = 0;
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].receiverId === userId && !messages[i].isRead) {
          count++;
        }
      }
      return count;
    },

    /**
     * 标记消息为已读
     * @param {string} messageId
     * @returns {boolean}
     */
    markRead: function (messageId) {
      if (!messageId) return false;
      var messages = _getAll(KEYS.messages);
      var index = _findIndexById(messages, messageId);
      if (index === -1) return false;
      messages[index].isRead = true;
      messages[index].readAt = nowISO();
      _setAll(KEYS.messages, messages);
      return true;
    },

    /**
     * 标记某会话中所有消息为已读
     * @param {string} userId - 当前用户ID
     * @param {string} partnerId - 对方用户ID
     * @returns {number} 已标记数量
     */
    markConversationRead: function (userId, partnerId) {
      if (!userId || !partnerId) return 0;
      var messages = _getAll(KEYS.messages);
      var count = 0;
      var now = nowISO();
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].receiverId === userId &&
            messages[i].senderId === partnerId &&
            !messages[i].isRead) {
          messages[i].isRead = true;
          messages[i].readAt = now;
          count++;
        }
      }
      if (count > 0) {
        _setAll(KEYS.messages, messages);
      }
      return count;
    },

    // =========================================================================
    // 群组操作
    // =========================================================================

    /**
     * 获取所有群组
     * @returns {Array}
     */
    getGroups: function () {
      return _getAll(KEYS.groups);
    },

    /**
     * 根据ID获取群组
     * @param {string} id
     * @returns {Object|null}
     */
    getGroupById: function (id) {
      if (!id) return null;
      return _findById(_getAll(KEYS.groups), id);
    },

    /**
     * 加入群组
     * @param {string} groupId
     * @param {string} userId
     * @returns {boolean}
     */
    joinGroup: function (groupId, userId) {
      if (!groupId || !userId) return false;
      var groups = _getAll(KEYS.groups);
      var index = _findIndexById(groups, groupId);
      if (index === -1) return false;
      if (!Array.isArray(groups[index].members)) {
        groups[index].members = [];
      }
      if (groups[index].members.indexOf(userId) === -1) {
        groups[index].members.push(userId);
        groups[index].memberCount = groups[index].members.length;
        groups[index].updatedAt = nowISO();
        _setAll(KEYS.groups, groups);
      }
      return true;
    },

    /**
     * 退出群组
     * @param {string} groupId
     * @param {string} userId
     * @returns {boolean}
     */
    leaveGroup: function (groupId, userId) {
      if (!groupId || !userId) return false;
      var groups = _getAll(KEYS.groups);
      var index = _findIndexById(groups, groupId);
      if (index === -1) return false;
      if (!Array.isArray(groups[index].members)) return false;
      var memberIndex = groups[index].members.indexOf(userId);
      if (memberIndex !== -1) {
        groups[index].members.splice(memberIndex, 1);
        groups[index].memberCount = groups[index].members.length;
        groups[index].updatedAt = nowISO();
        _setAll(KEYS.groups, groups);
      }
      return true;
    },

    // =========================================================================
    // 活动操作
    // =========================================================================

    /**
     * 获取所有活动
     * @returns {Array}
     */
    getEvents: function () {
      return _getAll(KEYS.events);
    },

    /**
     * 根据ID获取活动
     * @param {string} id
     * @returns {Object|null}
     */
    getEventById: function (id) {
      if (!id) return null;
      return _findById(_getAll(KEYS.events), id);
    },

    /**
     * 报名参加活动
     * @param {string} eventId
     * @param {string} userId
     * @returns {boolean}
     */
    registerForEvent: function (eventId, userId) {
      if (!eventId || !userId) return false;
      var events = _getAll(KEYS.events);
      var index = _findIndexById(events, eventId);
      if (index === -1) return false;
      if (!Array.isArray(events[index].attendees)) {
        events[index].attendees = [];
      }
      if (events[index].attendees.indexOf(userId) === -1) {
        events[index].attendees.push(userId);
        events[index].attendeeCount = events[index].attendees.length;
        events[index].updatedAt = nowISO();
        _setAll(KEYS.events, events);
      }
      return true;
    },

    /**
     * 取消活动报名
     * @param {string} eventId
     * @param {string} userId
     * @returns {boolean}
     */
    unregisterFromEvent: function (eventId, userId) {
      if (!eventId || !userId) return false;
      var events = _getAll(KEYS.events);
      var index = _findIndexById(events, eventId);
      if (index === -1) return false;
      if (!Array.isArray(events[index].attendees)) return false;
      var attIndex = events[index].attendees.indexOf(userId);
      if (attIndex !== -1) {
        events[index].attendees.splice(attIndex, 1);
        events[index].attendeeCount = events[index].attendees.length;
        events[index].updatedAt = nowISO();
        _setAll(KEYS.events, events);
      }
      return true;
    },

    // =========================================================================
    // 成功故事
    // =========================================================================

    /**
     * 获取所有已发布的成功故事
     * @returns {Array}
     */
    getStories: function () {
      var stories = _getAll(KEYS.stories);
      return stories.filter(function (s) { return s.status === 'published'; });
    },

    // =========================================================================
    // 设置操作
    // =========================================================================

    /**
     * 获取字体缩放设置
     * @returns {string} 'normal', 'large', 'xlarge'
     */
    getFontScale: function () {
      return storageGet(KEYS.fontScale, 'normal');
    },

    /**
     * 设置字体缩放
     * @param {string} scale - 'normal', 'large', 'xlarge'
     */
    setFontScale: function (scale) {
      var validScales = ['normal', 'large', 'xlarge'];
      if (validScales.indexOf(scale) === -1) {
        scale = 'normal';
      }
      storageSet(KEYS.fontScale, scale);
    },

    /**
     * 获取隐私设置
     * @param {string} userId
     * @returns {Object}
     */
    getPrivacySettings: function (userId) {
      if (!userId) return {};
      var allSettings = storageGet(KEYS.privacySettings, {});
      return allSettings[userId] || {
        showPhone: false,
        showEmail: false,
        showLocation: true,
        allowMessages: true,
        showOnline: true
      };
    },

    /**
     * 更新隐私设置
     * @param {string} userId
     * @param {Object} settings
     */
    updatePrivacySettings: function (userId, settings) {
      if (!userId || !settings) return;
      var allSettings = storageGet(KEYS.privacySettings, {});
      allSettings[userId] = Object.assign(
        this.getPrivacySettings(userId),
        settings
      );
      storageSet(KEYS.privacySettings, allSettings);
    },

    /**
     * 屏蔽用户
     * @param {string} userId - 当前用户ID
     * @param {string} blockedUserId - 被屏蔽的用户ID
     */
    blockUser: function (userId, blockedUserId) {
      if (!userId || !blockedUserId) return;
      var allBlocks = storageGet(KEYS.blockedUsers, {});
      if (!allBlocks[userId]) {
        allBlocks[userId] = [];
      }
      if (allBlocks[userId].indexOf(blockedUserId) === -1) {
        allBlocks[userId].push(blockedUserId);
        storageSet(KEYS.blockedUsers, allBlocks);
      }
    },

    /**
     * 取消屏蔽用户
     * @param {string} userId
     * @param {string} blockedUserId
     */
    unblockUser: function (userId, blockedUserId) {
      if (!userId || !blockedUserId) return;
      var allBlocks = storageGet(KEYS.blockedUsers, {});
      if (allBlocks[userId]) {
        var index = allBlocks[userId].indexOf(blockedUserId);
        if (index !== -1) {
          allBlocks[userId].splice(index, 1);
          storageSet(KEYS.blockedUsers, allBlocks);
        }
      }
    },

    /**
     * 获取被屏蔽的用户ID列表
     * @param {string} userId
     * @returns {Array}
     */
    getBlockedUsers: function (userId) {
      if (!userId) return [];
      var allBlocks = storageGet(KEYS.blockedUsers, {});
      return allBlocks[userId] || [];
    },

    // =========================================================================
    // 初始化与种子数据
    // =========================================================================

    /**
     * 初始化数据存储。首次运行时填充种子数据。
     */
    init: function () {
      // 检查是否已初始化
      var initialized = storageGet('dating_app_initialized', false);
      if (initialized) {
        console.log('📦 数据存储已就绪，使用现有数据');
        return;
      }
      console.log('🌱 首次运行，正在初始化种子数据...');
      this._seedData();
      storageSet('dating_app_initialized', true);
      console.log('✅ 种子数据初始化完成');
    },

    /**
     * 填充演示种子数据
     * @private
     */
    _seedData: function () {
      var now = new Date().toISOString();

      // --- 种子用户 ---
      var seedUsers = [
        { id: 'u_demo_001', email: 'zhangwei@example.com', phone: '13800010001', password: simpleHash('123456'), name: '张伟', gender: '男', birthDate: '1975-03-15', location: { province: '北京市', city: '北京市', district: '朝阳区' }, isVerified: true, isVip: true, avatar: '', role: 'user', status: 'active', createdAt: now, updatedAt: now, lastLoginAt: null },
        { id: 'u_demo_002', email: 'lining@example.com', phone: '13800010002', password: simpleHash('123456'), name: '李宁', gender: '女', birthDate: '1978-08-22', location: { province: '上海市', city: '上海市', district: '浦东新区' }, isVerified: true, isVip: false, avatar: '', role: 'user', status: 'active', createdAt: now, updatedAt: now, lastLoginAt: null },
        { id: 'u_demo_003', email: 'wangfang@example.com', phone: '13800010003', password: simpleHash('123456'), name: '王芳', gender: '女', birthDate: '1980-01-10', location: { province: '广东省', city: '广州市', district: '天河区' }, isVerified: true, isVip: false, avatar: '', role: 'user', status: 'active', createdAt: now, updatedAt: now, lastLoginAt: null },
        { id: 'u_demo_004', email: 'liuqiang@example.com', phone: '13800010004', password: simpleHash('123456'), name: '刘强', gender: '男', birthDate: '1972-11-30', location: { province: '北京市', city: '北京市', district: '海淀区' }, isVerified: true, isVip: true, avatar: '', role: 'user', status: 'active', createdAt: now, updatedAt: now, lastLoginAt: null },
        { id: 'u_demo_005', email: 'chenxiu@example.com', phone: '13800010005', password: simpleHash('123456'), name: '陈秀英', gender: '女', birthDate: '1976-06-18', location: { province: '浙江省', city: '杭州市', district: '西湖区' }, isVerified: true, isVip: false, avatar: '', role: 'user', status: 'active', createdAt: now, updatedAt: now, lastLoginAt: null },
        { id: 'u_demo_006', email: 'yangming@example.com', phone: '13800010006', password: simpleHash('123456'), name: '杨明', gender: '男', birthDate: '1970-09-05', location: { province: '四川省', city: '成都市', district: '武侯区' }, isVerified: true, isVip: false, avatar: '', role: 'user', status: 'active', createdAt: now, updatedAt: now, lastLoginAt: null },
        { id: 'u_demo_007', email: 'zhaohong@example.com', phone: '13800010007', password: simpleHash('123456'), name: '赵红梅', gender: '女', birthDate: '1979-12-25', location: { province: '江苏省', city: '南京市', district: '鼓楼区' }, isVerified: true, isVip: false, avatar: '', role: 'user', status: 'active', createdAt: now, updatedAt: now, lastLoginAt: null },
        { id: 'u_demo_008', email: 'sunlei@example.com', phone: '13800010008', password: simpleHash('123456'), name: '孙磊', gender: '男', birthDate: '1974-04-12', location: { province: '湖北省', city: '武汉市', district: '武昌区' }, isVerified: true, isVip: false, avatar: '', role: 'user', status: 'active', createdAt: now, updatedAt: now, lastLoginAt: null }
      ];

      // --- 种子资料 ---
      var seedProfiles = [
        { id: 'prf_demo_001', userId: 'u_demo_001', height: 175, weight: 72, education: '本科', occupation: '工程师', income: '10000-20000', incomeRange: '10000-20000', maritalStatus: '离异', hasChildren: true, childrenDetails: '有一个女儿，跟前妻生活', hobbies: ['跑步', '读书', '旅游'], personality: ['稳重', '顾家', '幽默'], selfIntro: '北京本地人，有房有车，性格稳重踏实。平时喜欢跑步和读书，周末经常去郊外旅游。希望找一个温柔贤惠的女士共度余生。', photos: [], partnerAgeMin: 35, partnerAgeMax: 48, partnerEducation: '高中及以上', partnerIncome: '不限', partnerRequirements: '温柔贤惠，善解人意，能接受我有孩子', partnerMaritalPref: '不限', verificationStatus: 'verified', createdAt: now, updatedAt: now },
        { id: 'prf_demo_002', userId: 'u_demo_002', height: 162, weight: 55, education: '大专', occupation: '护士', income: '5000-10000', incomeRange: '5000-10000', maritalStatus: '丧偶', hasChildren: true, childrenDetails: '有一个儿子，上初中', hobbies: ['烹饪', '园艺', '广场舞'], personality: ['温柔', '善良', '勤快'], selfIntro: '上海人，在医院工作多年，性格温柔善良。喜欢做饭和养花，生活规律。希望找一个有责任心、懂得疼人的男士。', photos: [], partnerAgeMin: 42, partnerAgeMax: 58, partnerEducation: '大专及以上', partnerIncome: '8000以上', partnerRequirements: '有责任心，身体健康，不抽烟不酗酒', partnerMaritalPref: '不限', verificationStatus: 'verified', createdAt: now, updatedAt: now },
        { id: 'prf_demo_003', userId: 'u_demo_003', height: 160, weight: 52, education: '本科', occupation: '会计', income: '8000-15000', incomeRange: '8000-15000', maritalStatus: '离异', hasChildren: false, childrenDetails: '', hobbies: ['瑜伽', '阅读', '烘焙'], personality: ['独立', '知性', '细心'], selfIntro: '广州人，注册会计师，工作稳定。喜欢瑜伽和阅读，生活态度积极乐观。希望找一个志同道合的伴侣，一起享受生活。', photos: [], partnerAgeMin: 40, partnerAgeMax: 52, partnerEducation: '本科及以上', partnerIncome: '10000以上', partnerRequirements: '有稳定工作，性格开朗，不斤斤计较', partnerMaritalPref: '不限', verificationStatus: 'verified', createdAt: now, updatedAt: now },
        { id: 'prf_demo_004', userId: 'u_demo_004', height: 178, weight: 78, education: '硕士', occupation: '企业高管', income: '20000以上', incomeRange: '20000以上', maritalStatus: '离异', hasChildren: true, childrenDetails: '有一个儿子，已工作', hobbies: ['高尔夫', '摄影', '书法'], personality: ['成熟', '大气', '有涵养'], selfIntro: '北京人，企业高管，经济条件优越。爱好广泛，喜欢摄影和书法。孩子已经独立，希望找一个温柔体贴的人生伴侣。', photos: [], partnerAgeMin: 38, partnerAgeMax: 50, partnerEducation: '大专及以上', partnerIncome: '不限', partnerRequirements: '温柔体贴，有共同语言，形象气质佳', partnerMaritalPref: '离异或丧偶均可', verificationStatus: 'verified', createdAt: now, updatedAt: now },
        { id: 'prf_demo_005', userId: 'u_demo_005', height: 158, weight: 50, education: '本科', occupation: '教师', income: '8000-12000', incomeRange: '8000-12000', maritalStatus: '离异', hasChildren: false, childrenDetails: '', hobbies: ['阅读', '茶道', '太极拳'], personality: ['文静', '贤惠', '传统'], selfIntro: '杭州人，中学教师，喜欢传统文化。生活简单而有品质，喜欢品茶和练习太极拳。希望找一个稳重顾家的男士。', photos: [], partnerAgeMin: 44, partnerAgeMax: 56, partnerEducation: '大专及以上', partnerIncome: '8000以上', partnerRequirements: '稳重顾家，不抽烟，最好有共同爱好', partnerMaritalPref: '不限', verificationStatus: 'verified', createdAt: now, updatedAt: now },
        { id: 'prf_demo_006', userId: 'u_demo_006', height: 172, weight: 70, education: '大专', occupation: '个体经营', income: '15000-30000', incomeRange: '15000-30000', maritalStatus: '丧偶', hasChildren: true, childrenDetails: '有一个女儿，上大学', hobbies: ['钓鱼', '下棋', '爬山'], personality: ['开朗', '实在', '勤快'], selfIntro: '成都人，自己开店做生意，收入稳定。性格开朗实在，不抽烟不喝酒。喜欢户外活动，希望找一个性格好的女士作伴。', photos: [], partnerAgeMin: 42, partnerAgeMax: 54, partnerEducation: '不限', partnerIncome: '不限', partnerRequirements: '性格好，身体健康，能一起过日子', partnerMaritalPref: '不限', verificationStatus: 'verified', createdAt: now, updatedAt: now },
        { id: 'prf_demo_007', userId: 'u_demo_007', height: 163, weight: 54, education: '本科', occupation: '公务员', income: '10000-15000', incomeRange: '10000-15000', maritalStatus: '离异', hasChildren: true, childrenDetails: '有一个女儿，上高中', hobbies: ['羽毛球', '看电影', '美食'], personality: ['开朗', '大方', '能干'], selfIntro: '南京人，在政府部门工作，生活稳定。性格开朗大方，喜欢运动。希望能找到一个志趣相投、互相扶持的伴侣。', photos: [], partnerAgeMin: 42, partnerAgeMax: 55, partnerEducation: '大专及以上', partnerIncome: '10000以上', partnerRequirements: '有稳定工作，为人正直，有担当', partnerMaritalPref: '不限', verificationStatus: 'verified', createdAt: now, updatedAt: now },
        { id: 'prf_demo_008', userId: 'u_demo_008', height: 176, weight: 75, education: '本科', occupation: '医生', income: '15000-25000', incomeRange: '15000-25000', maritalStatus: '离异', hasChildren: false, childrenDetails: '', hobbies: ['游泳', '音乐', '养狗'], personality: ['细心', '温和', '有耐心'], selfIntro: '武汉人，三甲医院医生，工作稳定受人尊敬。性格温和细心，有耐心。喜欢游泳和音乐，养了一只金毛。期待遇见有缘人。', photos: [], partnerAgeMin: 38, partnerAgeMax: 50, partnerEducation: '大专及以上', partnerIncome: '不限', partnerRequirements: '性格温和，善良，愿意来武汉生活', partnerMaritalPref: '不限', verificationStatus: 'verified', createdAt: now, updatedAt: now }
      ];

      // --- 种子群组 ---
      var seedGroups = [
        { id: 'grp_demo_001', name: '中年单身交流群', description: '欢迎各位中年单身朋友加入，一起交流生活、情感话题', category: '交流', tags: ['单身', '交流', '生活'], creatorId: 'u_demo_001', members: ['u_demo_001', 'u_demo_002', 'u_demo_003', 'u_demo_004'], memberCount: 4, maxMembers: 200, createdAt: now, updatedAt: now },
        { id: 'grp_demo_002', name: '户外徒步爱好者', description: '组织各种户外徒步、登山活动，强身健体，结识朋友', category: '运动', tags: ['户外', '徒步', '运动'], creatorId: 'u_demo_006', members: ['u_demo_006', 'u_demo_005', 'u_demo_008'], memberCount: 3, maxMembers: 100, createdAt: now, updatedAt: now },
        { id: 'grp_demo_003', name: '美食烹饪分享群', description: '分享美食制作、餐厅推荐，以食会友', category: '生活', tags: ['美食', '烹饪', '生活'], creatorId: 'u_demo_002', members: ['u_demo_002', 'u_demo_003', 'u_demo_007', 'u_demo_005'], memberCount: 4, maxMembers: 150, createdAt: now, updatedAt: now }
      ];

      // --- 种子活动 ---
      var seedEvents = [
        { id: 'evt_demo_001', title: '周末公园相亲角聚会', description: '每周末在朝阳公园举办的相亲角活动，免费参加，欢迎各位中年单身朋友踊跃报名', location: '北京市朝阳公园', eventDate: '2026-07-05T09:00:00', category: '相亲', organizerId: 'u_demo_001', maxAttendees: 50, attendees: ['u_demo_001'], attendeeCount: 1, status: 'upcoming', createdAt: now, updatedAt: now },
        { id: 'evt_demo_002', title: '中年交友下午茶', description: '在环境优雅的茶馆举办交友下午茶活动，轻松愉快的氛围中认识新朋友', location: '上海市静安区某茶馆', eventDate: '2026-07-12T14:00:00', category: '交友', organizerId: 'u_demo_002', maxAttendees: 30, attendees: ['u_demo_002'], attendeeCount: 1, status: 'upcoming', createdAt: now, updatedAt: now },
        { id: 'evt_demo_003', title: '户外徒步·西山行', description: '组织一次西山徒步活动，沿途欣赏美景，锻炼身体的同时结识新朋友', location: '北京市西山国家森林公园', eventDate: '2026-07-19T08:00:00', category: '户外', organizerId: 'u_demo_006', maxAttendees: 20, attendees: ['u_demo_006', 'u_demo_008'], attendeeCount: 2, status: 'upcoming', createdAt: now, updatedAt: now }
      ];

      // --- 种子成功故事 ---
      var seedStories = [
        { id: 'sty_demo_001', title: '感谢相亲网让我遇见了她', content: '我是一名离异的中年男士，通过这个网站认识了现在的妻子。我们年龄相仿，兴趣相投，现在生活得很幸福。感谢网站为我们提供了这个平台！', authorId: 'u_demo_001', partnerName: '王女士', marriedDate: '2025-10-01', photo: '', status: 'published', createdAt: now, updatedAt: now },
        { id: 'sty_demo_002', title: '中年也能找到真爱', content: '丧偶多年后，在家人的鼓励下我注册了相亲网。没想到真的遇到了合适的人，我们相处一年多后结婚了。想对大家说，不要放弃寻找幸福。', authorId: 'u_demo_002', partnerName: '赵先生', marriedDate: '2026-02-14', photo: '', status: 'published', createdAt: now, updatedAt: now }
      ];

      // 写入 localStorage
      storageSet(KEYS.users, seedUsers);
      storageSet(KEYS.profiles, seedProfiles);
      storageSet(KEYS.messages, []);
      storageSet(KEYS.matches, []);
      storageSet(KEYS.groups, seedGroups);
      storageSet(KEYS.events, seedEvents);
      storageSet(KEYS.stories, seedStories);
      storageSet(KEYS.blockedUsers, {});
      storageSet(KEYS.privacySettings, {});
      storageSet(KEYS.fontScale, 'normal');
      storageSet(KEYS.currentUser, null);
    }
  };

  // 挂载到全局
  window.Store = Store;

  // 自动初始化数据（确保种子数据在任何页面都能加载）
  Store.init();

  console.log('✅ store.js 已加载 - 数据存储层就绪');
})();
