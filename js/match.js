/**
 * 中年相亲网 - 匹配推荐引擎
 * 计算用户之间的兼容性评分，提供推荐和搜索功能
 * 所有用户界面文本使用中文
 */
(function () {
  'use strict';

  /**
   * 匹配权重配置
   * 可调整以改变推荐算法倾向
   */
  var WEIGHTS = {
    hobbyOverlap: 0.25,       // 兴趣爱好重合度
    personalityMatch: 0.20,   // 性格特征匹配
    educationMatch: 0.15,     // 学历匹配
    ageProximity: 0.15,       // 年龄接近度
    locationProximity: 0.10,  // 地理位置接近度
    incomeAlignment: 0.10,    // 收入水平匹配
    verificationBonus: 0.05   // 实名认证加分
  };

  /**
   * 学历层级映射（用于计算学历匹配度）
   */
  var EDUCATION_LEVELS = {
    '高中及以下': 1,
    '中专': 2,
    '大专': 3,
    '本科': 4,
    '硕士': 5,
    '博士': 6
  };

  /**
   * 收入层级映射（用于计算收入匹配度）
   */
  var INCOME_LEVELS = {
    '3000以下': 1,
    '3000-5000': 2,
    '5000-8000': 3,
    '8000-10000': 4,
    '10000-15000': 5,
    '15000-20000': 6,
    '20000以上': 7
  };

  var MatchEngine = {
    // =========================================================================
    // 核心评分函数
    // =========================================================================

    /**
     * 计算两个用户之间的兼容性评分（0-100）
     * @param {string} userId1 - 用户1的ID
     * @param {string} userId2 - 用户2的ID
     * @returns {number} 评分（0-100）
     */
    calculateScore: function (userId1, userId2) {
      try {
        if (!userId1 || !userId2 || userId1 === userId2) return 0;

        var user1 = Store.getUserById(userId1);
        var user2 = Store.getUserById(userId2);
        var profile1 = Store.getProfile(userId1);
        var profile2 = Store.getProfile(userId2);

        if (!user1 || !user2) return 0;
        // 如果有资料缺失，仍尝试计算
        if (!profile1 && !profile2) return 10; // 最低基础分

        // 检查是否在对方屏蔽列表中
        var blockedBy1 = Store.getBlockedUsers(userId1);
        var blockedBy2 = Store.getBlockedUsers(userId2);
        if (blockedBy1.indexOf(userId2) !== -1 || blockedBy2.indexOf(userId1) !== -1) {
          return -1; // -1 表示被屏蔽，不应推荐
        }

        var scores = {};

        // 1. 兴趣爱好重合度 (25%)
        scores.hobbyOverlap = this._calcHobbyOverlap(profile1, profile2);

        // 2. 性格特征匹配 (20%)
        scores.personalityMatch = this._calcPersonalityMatch(profile1, profile2);

        // 3. 学历匹配 (15%)
        scores.educationMatch = this._calcEducationMatch(profile1, profile2);

        // 4. 年龄接近度 (15%)
        scores.ageProximity = this._calcAgeProximity(user1, user2);

        // 5. 地理位置接近度 (10%)
        scores.locationProximity = this._calcLocationProximity(user1, user2);

        // 6. 收入水平匹配 (10%)
        scores.incomeAlignment = this._calcIncomeAlignment(profile1, profile2);

        // 7. 实名认证加分 (5%)
        scores.verificationBonus = this._calcVerificationBonus(user1, user2);

        // 加权汇总
        var totalScore = 0;
        for (var key in WEIGHTS) {
          if (WEIGHTS.hasOwnProperty(key) && scores.hasOwnProperty(key)) {
            totalScore += scores[key] * WEIGHTS[key];
          }
        }

        // 转换为百分制并限制范围
        var finalScore = Math.round(totalScore * 100);
        finalScore = Math.max(0, Math.min(100, finalScore));

        return finalScore;
      } catch (e) {
        console.error('calculateScore error:', e);
        return 0;
      }
    },

    /**
     * 计算兴趣爱好重合度（Jaccard相似度）
     * @private
     */
    _calcHobbyOverlap: function (profile1, profile2) {
      try {
        var hobbies1 = (profile1 && Array.isArray(profile1.hobbies)) ? profile1.hobbies : [];
        var hobbies2 = (profile2 && Array.isArray(profile2.hobbies)) ? profile2.hobbies : [];

        if (hobbies1.length === 0 && hobbies2.length === 0) return 0.3; // 都没有偏好，给中值
        if (hobbies1.length === 0 || hobbies2.length === 0) return 0.1;

        // 标准化：转为小写进行比较
        var set1 = {};
        for (var i = 0; i < hobbies1.length; i++) {
          set1[hobbies1[i].toLowerCase().trim()] = true;
        }
        var set2 = {};
        for (var j = 0; j < hobbies2.length; j++) {
          set2[hobbies2[j].toLowerCase().trim()] = true;
        }

        // 计算交集大小
        var intersection = 0;
        var keys1 = Object.keys(set1);
        for (var k = 0; k < keys1.length; k++) {
          if (set2[keys1[k]]) {
            intersection++;
          }
        }

        // Jaccard相似度
        var union = Object.keys(set1).length + Object.keys(set2).length - intersection;
        if (union === 0) return 0;

        return intersection / union;
      } catch (e) {
        return 0;
      }
    },

    /**
     * 计算性格特征匹配度
     * @private
     */
    _calcPersonalityMatch: function (profile1, profile2) {
      try {
        var traits1 = (profile1 && Array.isArray(profile1.personality)) ? profile1.personality : [];
        var traits2 = (profile2 && Array.isArray(profile2.personality)) ? profile2.personality : [];

        if (traits1.length === 0 && traits2.length === 0) return 0.5; // 都没有填，给中等分

        // 互补性格配对（某些性格组合在一起更和谐）
        var complementaryPairs = {
          '稳重': ['温柔', '贤惠', '细心'],
          '开朗': ['文静', '稳重', '善良'],
          '独立': ['成熟', '大度', '稳重'],
          '幽默': ['开朗', '大方', '善良'],
          '顾家': ['贤惠', '温柔', '勤快'],
          '细心': ['稳重', '温柔', '体贴'],
          '温柔': ['稳重', '成熟', '有担当'],
          '成熟': ['温柔', '独立', '贤惠']
        };

        // 计算直接匹配
        var set2 = {};
        for (var i = 0; i < traits2.length; i++) {
          set2[traits2[i].toLowerCase().trim()] = true;
        }

        var directMatch = 0;
        for (var j = 0; j < traits1.length; j++) {
          if (set2[traits1[j].toLowerCase().trim()]) {
            directMatch++;
          }
        }

        // 计算互补匹配
        var complementMatch = 0;
        for (var k = 0; k < traits1.length; k++) {
          var trait1 = traits1[k].trim();
          var complements = complementaryPairs[trait1];
          if (complements) {
            for (var m = 0; m < traits2.length; m++) {
              if (complements.indexOf(traits2[m].trim()) !== -1) {
                complementMatch += 0.5; // 互补匹配权重略低
                break;
              }
            }
          }
        }

        var maxTraits = Math.max(traits1.length, traits2.length);
        if (maxTraits === 0) return 0.3;

        // 综合直接匹配和互补匹配
        var directScore = maxTraits > 0 ? directMatch / maxTraits : 0;
        var complementScore = maxTraits > 0 ? complementMatch / maxTraits : 0;

        return Math.min(1, directScore * 0.6 + complementScore * 0.4);
      } catch (e) {
        return 0.3;
      }
    },

    /**
     * 计算学历匹配度
     * @private
     */
    _calcEducationMatch: function (profile1, profile2) {
      try {
        var edu1 = profile1 && profile1.education ? profile1.education : '';
        var edu2 = profile2 && profile2.education ? profile2.education : '';

        if (!edu1 || !edu2) return 0.5; // 有一方未填写

        if (edu1 === edu2) return 1.0; // 学历相同

        var level1 = EDUCATION_LEVELS[edu1] || 3;
        var level2 = EDUCATION_LEVELS[edu2] || 3;

        var diff = Math.abs(level1 - level2);
        if (diff <= 1) return 0.8;
        if (diff <= 2) return 0.5;
        return 0.2;
      } catch (e) {
        return 0.5;
      }
    },

    /**
     * 计算年龄接近度
     * @private
     */
    _calcAgeProximity: function (user1, user2) {
      try {
        var age1 = calculateAge(user1.birthDate);
        var age2 = calculateAge(user2.birthDate);

        if (age1 === null || age2 === null) return 0.3;

        var diff = Math.abs(age1 - age2);

        // 年龄差评分
        if (diff <= 2) return 1.0;    // 差0-2岁，满分
        if (diff <= 5) return 0.85;   // 差3-5岁
        if (diff <= 8) return 0.6;    // 差6-8岁
        if (diff <= 12) return 0.4;   // 差9-12岁
        if (diff <= 15) return 0.2;   // 差13-15岁
        return 0.05;                   // 差15岁以上
      } catch (e) {
        return 0.3;
      }
    },

    /**
     * 计算地理位置接近度
     * @private
     */
    _calcLocationProximity: function (user1, user2) {
      try {
        var loc1 = user1.location || {};
        var loc2 = user2.location || {};

        var province1 = (loc1.province || '').trim();
        var city1 = (loc1.city || '').trim();
        var province2 = (loc2.province || '').trim();
        var city2 = (loc2.city || '').trim();

        if (!province1 || !province2) return 0.3;

        if (city1 && city2 && city1 === city2) {
          return 1.0; // 同城，满分
        }
        if (province1 === province2) {
          return 0.7; // 同省不同城
        }
        // 相邻省份判定（简化版）
        var adjacentProvinces = {
          '北京市': ['天津市', '河北省'],
          '上海市': ['江苏省', '浙江省'],
          '广东省': ['广西壮族自治区', '福建省', '江西省', '湖南省'],
          '浙江省': ['上海市', '江苏省', '安徽省', '福建省', '江西省'],
          '江苏省': ['上海市', '浙江省', '安徽省', '山东省'],
          '四川省': ['重庆市', '贵州省', '云南省', '陕西省', '甘肃省'],
          '湖北省': ['湖南省', '河南省', '安徽省', '江西省', '重庆市'],
          '山东省': ['河北省', '河南省', '安徽省', '江苏省'],
          '辽宁省': ['吉林省', '河北省'],
          '福建省': ['浙江省', '江西省', '广东省']
        };

        var adjacent1 = adjacentProvinces[province1];
        if (adjacent1 && adjacent1.indexOf(province2) !== -1) {
          return 0.4; // 相邻省份
        }

        return 0.1; // 距离较远
      } catch (e) {
        return 0.3;
      }
    },

    /**
     * 计算收入匹配度
     * @private
     */
    _calcIncomeAlignment: function (profile1, profile2) {
      try {
        var inc1 = (profile1 && profile1.incomeRange) ? profile1.incomeRange : '';
        var inc2 = (profile2 && profile2.incomeRange) ? profile2.incomeRange : '';

        if (!inc1 || !inc2) return 0.5; // 有一方未填写

        if (inc1 === inc2) return 1.0; // 收入水平相同

        var level1 = INCOME_LEVELS[inc1];
        var level2 = INCOME_LEVELS[inc2];

        if (!level1 || !level2) return 0.5;

        var diff = Math.abs(level1 - level2);
        if (diff <= 1) return 0.85;
        if (diff <= 2) return 0.6;
        if (diff <= 3) return 0.35;
        return 0.15;
      } catch (e) {
        return 0.5;
      }
    },

    /**
     * 计算实名认证加分
     * @private
     */
    _calcVerificationBonus: function (user1, user2) {
      try {
        var bonus = 0;
        if (user1.isVerified && user2.isVerified) bonus = 1.0;
        else if (user1.isVerified || user2.isVerified) bonus = 0.5;
        else bonus = 0;
        return bonus;
      } catch (e) {
        return 0;
      }
    },

    // =========================================================================
    // 硬性过滤
    // =========================================================================

    /**
     * 检查目标用户是否通过当前用户的硬性过滤条件
     * @param {Object} user - 目标用户
     * @param {Object} targetProfile - 目标用户的资料
     * @param {Object} preferences - 当前用户的择偶偏好
     * @returns {boolean}
     */
    passesHardFilters: function (user, targetProfile, preferences) {
      try {
        if (!user || !preferences) return true; // 没有偏好就不过滤

        // 性别过滤：只显示异性
        // 这个由调用方处理

        // 年龄范围过滤
        if (preferences.partnerAgeMin || preferences.partnerAgeMax) {
          var targetAge = calculateAge(user.birthDate);
          if (targetAge === null) return false;
          if (preferences.partnerAgeMin && targetAge < preferences.partnerAgeMin) return false;
          if (preferences.partnerAgeMax && targetAge > preferences.partnerAgeMax) return false;
        }

        // 学历过滤
        if (preferences.partnerEducation && preferences.partnerEducation !== '不限' && targetProfile) {
          var targetEduLevel = EDUCATION_LEVELS[targetProfile.education] || 0;
          var minEduLevel = EDUCATION_LEVELS[preferences.partnerEducation] || 0;
          if (minEduLevel > 0 && targetEduLevel > 0 && targetEduLevel < minEduLevel) return false;
        }

        // 婚姻状况过滤
        if (preferences.partnerMaritalPref && preferences.partnerMaritalPref !== '不限' && targetProfile) {
          if (targetProfile.maritalStatus !== preferences.partnerMaritalPref) return false;
        }

        // 收入过滤
        if (preferences.partnerIncome && preferences.partnerIncome !== '不限' && targetProfile) {
          var targetIncLevel = INCOME_LEVELS[targetProfile.incomeRange] || 0;
          var minIncLevel = INCOME_LEVELS[preferences.partnerIncome] || 0;
          if (minIncLevel > 0 && targetIncLevel > 0 && targetIncLevel < minIncLevel) return false;
        }

        return true;
      } catch (e) {
        console.error('passesHardFilters error:', e);
        return true; // 出错时不过滤
      }
    },

    // =========================================================================
    // 推荐算法
    // =========================================================================

    /**
     * 获取推荐用户列表
     * @param {string} userId - 当前用户ID
     * @param {number} limit - 返回数量上限，默认20
     * @returns {Array} 推荐用户列表（含评分）
     */
    getRecommendations: function (userId, limit) {
      try {
        limit = limit || 20;
        if (!userId) return [];

        var currentUser = Store.getUserById(userId);
        var currentProfile = Store.getProfile(userId);
        if (!currentUser) return [];

        var allUsers = Store.getUsers();
        var blockedUsers = Store.getBlockedUsers(userId);
        var blockedSet = {};
        for (var b = 0; b < blockedUsers.length; b++) {
          blockedSet[blockedUsers[b]] = true;
        }

        // 获取已有的匹配记录，避免重复推荐已匹配的用户
        var existingMatches = Store.getMatches(userId);
        var matchedUserIds = {};
        for (var em = 0; em < existingMatches.length; em++) {
          var m = existingMatches[em];
          if (m.status === 'matched') {
            matchedUserIds[m.userId === userId ? m.targetUserId : m.userId] = true;
          }
        }

        var candidates = [];

        for (var i = 0; i < allUsers.length; i++) {
          var candidate = allUsers[i];

          // 跳过自己
          if (candidate.id === userId) continue;
          // 跳过非活跃用户
          if (candidate.status !== 'active') continue;
          // 跳过被屏蔽的用户
          if (blockedSet[candidate.id]) continue;
          // 跳过已匹配的用户
          if (matchedUserIds[candidate.id]) continue;

          // 性别过滤：只推荐异性
          if (currentUser.gender && candidate.gender && currentUser.gender === candidate.gender) {
            continue;
          }

          // 硬性过滤
          var candidateProfile = Store.getProfile(candidate.id);
          if (!this.passesHardFilters(candidate, candidateProfile, currentProfile)) {
            continue;
          }

          // 也检查对方是否屏蔽了当前用户
          var theirBlocks = Store.getBlockedUsers(candidate.id);
          if (theirBlocks.indexOf(userId) !== -1) continue;

          // 计算评分
          var score = this.calculateScore(userId, candidate.id);
          if (score < 0) continue; // 负分表示不应推荐

          candidates.push({
            user: candidate,
            profile: candidateProfile,
            score: score,
            age: calculateAge(candidate.birthDate)
          });
        }

        // 按评分降序排列
        candidates.sort(function (a, b) {
          return b.score - a.score;
        });

        // 截取前N个
        return candidates.slice(0, limit);
      } catch (e) {
        console.error('getRecommendations error:', e);
        return [];
      }
    },

    /**
     * 获取每日推荐匹配（从高分中随机选取）
     * @param {string} userId - 当前用户ID
     * @param {number} count - 推荐数量，默认8
     * @returns {Array}
     */
    getDailyMatches: function (userId, count) {
      try {
        count = count || 8;
        // 获取前50个高分推荐
        var topRecommendations = this.getRecommendations(userId, 50);
        if (topRecommendations.length === 0) return [];

        // 随机打乱并取前count个
        var shuffled = shuffle(topRecommendations);
        return shuffled.slice(0, Math.min(count, shuffled.length));
      } catch (e) {
        console.error('getDailyMatches error:', e);
        return [];
      }
    },

    // =========================================================================
    // 搜索功能
    // =========================================================================

    /**
     * 根据筛选条件搜索用户
     * @param {Object} filters - 筛选条件
     *   { ageMin, ageMax, gender, province, city, education, incomeRange,
     *     maritalStatus, hasChildren, hobbies, keyword, excludeUserId }
     * @returns {Array} 搜索结果（含评分）
     */
    search: function (filters) {
      try {
        if (!filters) filters = {};

        var excludeUserId = filters.excludeUserId || (currentUser ? currentUser.id : null);
        var allUsers = Store.getUsers();
        var allProfiles = Store.getAllProfiles();
        var results = [];

        // 建立 profile 索引
        var profileMap = {};
        for (var p = 0; p < allProfiles.length; p++) {
          profileMap[allProfiles[p].userId] = allProfiles[p];
        }

        for (var i = 0; i < allUsers.length; i++) {
          var user = allUsers[i];

          // 跳过自己
          if (excludeUserId && user.id === excludeUserId) continue;
          // 跳过非活跃用户
          if (user.status !== 'active') continue;

          var profile = profileMap[user.id] || Store.getProfile(user.id);
          var userAge = calculateAge(user.birthDate);

          // 性别过滤
          if (filters.gender && user.gender !== filters.gender) continue;

          // 年龄范围
          if (filters.ageMin && (userAge === null || userAge < filters.ageMin)) continue;
          if (filters.ageMax && (userAge === null || userAge > filters.ageMax)) continue;

          // 省份
          if (filters.province && (!user.location || user.location.province !== filters.province)) continue;

          // 城市
          if (filters.city && (!user.location || user.location.city !== filters.city)) continue;

          // 学历
          if (filters.education && filters.education !== '不限' && profile) {
            if (profile.education !== filters.education) continue;
          }

          // 收入范围
          if (filters.incomeRange && filters.incomeRange !== '不限' && profile) {
            if (profile.incomeRange !== filters.incomeRange) continue;
          }

          // 婚姻状况
          if (filters.maritalStatus && filters.maritalStatus !== '不限' && profile) {
            if (profile.maritalStatus !== filters.maritalStatus) continue;
          }

          // 子女情况
          if (filters.hasChildren !== undefined && filters.hasChildren !== null && filters.hasChildren !== '' && profile) {
            var hasChildrenFilter = filters.hasChildren;
            if (typeof hasChildrenFilter === 'string') {
              hasChildrenFilter = (hasChildrenFilter === 'true' || hasChildrenFilter === '是' || hasChildrenFilter === 'yes');
            }
            if (profile.hasChildren !== hasChildrenFilter) continue;
          }

          // 兴趣爱好
          if (filters.hobbies && filters.hobbies.length > 0 && profile) {
            var userHobbies = profile.hobbies || [];
            var hobbyMatch = false;
            for (var h = 0; h < filters.hobbies.length; h++) {
              for (var uh = 0; uh < userHobbies.length; uh++) {
                if (userHobbies[uh].toLowerCase().indexOf(filters.hobbies[h].toLowerCase()) !== -1) {
                  hobbyMatch = true;
                  break;
                }
              }
              if (hobbyMatch) break;
            }
            if (!hobbyMatch) continue;
          }

          // 关键词搜索（搜索自我介绍、姓名）
          if (filters.keyword && profile) {
            var kw = filters.keyword.toLowerCase();
            var selfIntro = (profile.selfIntro || '').toLowerCase();
            var userName = (user.name || '').toLowerCase();
            var occupation = (profile.occupation || '').toLowerCase();
            var education = (profile.education || '').toLowerCase();
            if (selfIntro.indexOf(kw) === -1 &&
                userName.indexOf(kw) === -1 &&
                occupation.indexOf(kw) === -1 &&
                education.indexOf(kw) === -1) {
              continue;
            }
          }

          // 计算评分（如果有当前用户）
          var score = 0;
          if (excludeUserId) {
            score = this.calculateScore(excludeUserId, user.id);
          }

          results.push({
            user: user,
            profile: profile,
            score: Math.max(0, score),
            age: userAge
          });
        }

        // 按评分降序
        results.sort(function (a, b) {
          return b.score - a.score;
        });

        return results;
      } catch (e) {
        console.error('search error:', e);
        return [];
      }
    },

    // =========================================================================
    // 辅助功能
    // =========================================================================

    /**
     * 获取快速筛选统计数据（用于搜索页面展示可选数量）
     * @param {string} userId - 当前用户ID（排除自己）
     * @returns {Object} 各项筛选的计数
     */
    getFilterStats: function (userId) {
      try {
        var users = Store.getUsers();
        var stats = {
          total: 0,
          provinces: {},
          educations: {},
          incomes: {},
          maritalStatuses: {}
        };

        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          if (user.id === userId) continue;
          if (user.status !== 'active') continue;
          stats.total++;

          // 省份统计
          var province = (user.location && user.location.province) ? user.location.province : '未知';
          stats.provinces[province] = (stats.provinces[province] || 0) + 1;

          // 学历统计
          var profile = Store.getProfile(user.id);
          if (profile) {
            var edu = profile.education || '未填写';
            stats.educations[edu] = (stats.educations[edu] || 0) + 1;

            var inc = profile.incomeRange || profile.income || '未填写';
            stats.incomes[inc] = (stats.incomes[inc] || 0) + 1;

            var ms = profile.maritalStatus || '未填写';
            stats.maritalStatuses[ms] = (stats.maritalStatuses[ms] || 0) + 1;
          }
        }

        return stats;
      } catch (e) {
        console.error('getFilterStats error:', e);
        return { total: 0, provinces: {}, educations: {}, incomes: {}, maritalStatuses: {} };
      }
    },

    /**
     * 检查两个用户之间是否有共同兴趣
     * @param {string} userId1
     * @param {string} userId2
     * @returns {Array} 共同兴趣列表
     */
    getCommonHobbies: function (userId1, userId2) {
      try {
        var p1 = Store.getProfile(userId1);
        var p2 = Store.getProfile(userId2);
        if (!p1 || !p2) return [];

        var hobbies1 = p1.hobbies || [];
        var hobbies2 = p2.hobbies || [];

        var set2 = {};
        for (var i = 0; i < hobbies2.length; i++) {
          set2[hobbies2[i].toLowerCase().trim()] = true;
        }

        var common = [];
        for (var j = 0; j < hobbies1.length; j++) {
          var h = hobbies1[j].toLowerCase().trim();
          if (set2[h]) {
            common.push(hobbies1[j]); // 保留原始大小写
          }
        }
        return common;
      } catch (e) {
        console.error('getCommonHobbies error:', e);
        return [];
      }
    },

    /**
     * 获取评分明细（用于展示匹配详情）
     * @param {string} userId1
     * @param {string} userId2
     * @returns {Object} 各项评分明细
     */
    getScoreBreakdown: function (userId1, userId2) {
      try {
        var user1 = Store.getUserById(userId1);
        var user2 = Store.getUserById(userId2);
        var profile1 = Store.getProfile(userId1);
        var profile2 = Store.getProfile(userId2);

        if (!user1 || !user2) return null;

        var breakdown = {
          total: this.calculateScore(userId1, userId2),
          hobbyOverlap: {
            score: Math.round(this._calcHobbyOverlap(profile1, profile2) * 100),
            weight: WEIGHTS.hobbyOverlap * 100,
            description: '兴趣爱好',
            common: this.getCommonHobbies(userId1, userId2)
          },
          personalityMatch: {
            score: Math.round(this._calcPersonalityMatch(profile1, profile2) * 100),
            weight: WEIGHTS.personalityMatch * 100,
            description: '性格匹配'
          },
          educationMatch: {
            score: Math.round(this._calcEducationMatch(profile1, profile2) * 100),
            weight: WEIGHTS.educationMatch * 100,
            description: '学历匹配'
          },
          ageProximity: {
            score: Math.round(this._calcAgeProximity(user1, user2) * 100),
            weight: WEIGHTS.ageProximity * 100,
            description: '年龄相仿'
          },
          locationProximity: {
            score: Math.round(this._calcLocationProximity(user1, user2) * 100),
            weight: WEIGHTS.locationProximity * 100,
            description: '距离接近'
          },
          incomeAlignment: {
            score: Math.round(this._calcIncomeAlignment(profile1, profile2) * 100),
            weight: WEIGHTS.incomeAlignment * 100,
            description: '收入匹配'
          },
          verificationBonus: {
            score: Math.round(this._calcVerificationBonus(user1, user2) * 100),
            weight: WEIGHTS.verificationBonus * 100,
            description: '实名认证'
          }
        };

        return breakdown;
      } catch (e) {
        console.error('getScoreBreakdown error:', e);
        return null;
      }
    }
  };

  // 挂载到全局
  window.MatchEngine = MatchEngine;

  console.log('✅ match.js 已加载 - 匹配推荐引擎就绪');
})();
