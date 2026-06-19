/**
 * 中年相亲网 - 身份验证模块
 * 处理登录、注册、登出和身份验证
 * 所有用户界面文本使用中文
 */
(function () {
  'use strict';

  // 全局当前用户引用（方便其他模块快速访问）
  var currentUser = null;

  var Auth = {
    // =========================================================================
    // 登录
    // =========================================================================

    /**
     * 处理登录表单提交
     * @param {HTMLFormElement|string} formElement - 表单元素或ID
     */
    handleLogin: function (formElement) {
      try {
        if (typeof formElement === 'string') {
          formElement = document.getElementById(formElement);
        }
        if (!formElement) {
          console.error('handleLogin: 找不到登录表单');
          showToast('系统错误，请刷新页面', 'error');
          return;
        }

        // 阻止默认提交
        formElement.addEventListener('submit', function (e) {
          e.preventDefault();
        });

        // 获取提交按钮
        var submitBtn = formElement.querySelector('button[type="submit"]');
        if (!submitBtn) {
          submitBtn = formElement.querySelector('.login-btn');
        }

        // 处理登录
        var self = this;
        function doLogin() {
          var formData = getFormData(formElement);

          // 验证表单
          var validation = self.validateLoginForm(formData);
          if (!validation.valid) {
            showToast(validation.message, 'error');
            return;
          }

          // 禁用按钮，显示加载状态
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '登录中...';
          }

          // 执行登录
          var account = formData.account || formData.email || formData.phone || '';
          var password = formData.password || '';

          var result = Store.login(account, password);

          if (result.success) {
            currentUser = result.user;
            window.currentUser = result.user;
            showToast('登录成功！正在跳转...', 'success');
            // 延迟跳转，让用户看到成功提示
            setTimeout(function () {
              window.location.href = 'dashboard.html';
            }, 500);
          } else {
            showToast(result.message, 'error');
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = '登录';
            }
          }
        }

        // 绑定提交事件
        if (submitBtn) {
          submitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            doLogin();
          });
        }

        // 也支持回车提交
        formElement.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            doLogin();
          }
        });

      } catch (e) {
        console.error('handleLogin error:', e);
        showToast('登录处理出错，请重试', 'error');
      }
    },

    /**
     * 验证登录表单
     * @param {Object} data - 表单数据
     * @returns {{ valid: boolean, message: string }}
     */
    validateLoginForm: function (data) {
      try {
        if (!data) {
          return { valid: false, message: '请填写登录信息' };
        }
        var account = (data.account || data.email || data.phone || '').trim();
        var password = (data.password || '').trim();

        if (!account) {
          return { valid: false, message: '请输入手机号或邮箱' };
        }
        if (!password) {
          return { valid: false, message: '请输入密码' };
        }

        // 判断账号类型
        if (account.indexOf('@') !== -1) {
          if (!isValidEmail(account)) {
            return { valid: false, message: '请输入正确的邮箱格式' };
          }
        } else {
          if (!isValidPhone(account)) {
            return { valid: false, message: '请输入正确的手机号格式（11位手机号码）' };
          }
        }

        var pwCheck = validatePassword(password);
        if (!pwCheck.valid) {
          return { valid: false, message: pwCheck.message };
        }

        return { valid: true, message: '' };
      } catch (e) {
        console.error('validateLoginForm error:', e);
        return { valid: false, message: '验证出错，请重试' };
      }
    },

    // =========================================================================
    // 注册（三步表单）
    // =========================================================================

    /**
     * 处理注册表单。支持三步注册流程。
     * @param {HTMLFormElement|string} formElement - 表单元素或ID
     * @param {number} step - 当前步骤（1、2、3）
     * @returns {{ valid: boolean, data: Object|null, message: string }}
     */
    handleRegister: function (formElement, step) {
      try {
        if (typeof formElement === 'string') {
          formElement = document.getElementById(formElement);
        }
        if (!formElement) {
          return { valid: false, data: null, message: '找不到注册表单' };
        }

        var formData = getFormData(formElement);
        var validation;

        switch (step) {
          case 1:
            validation = this.validateRegisterStep1(formData);
            break;
          case 2:
            validation = this.validateRegisterStep2(formData);
            break;
          case 3:
            validation = this.validateRegisterStep3(formData);
            if (validation.valid) {
              // 执行完整注册
              return this._completeRegistration(formData);
            }
            break;
          default:
            return { valid: false, data: null, message: '无效的注册步骤' };
        }

        return validation;
      } catch (e) {
        console.error('handleRegister error:', e);
        return { valid: false, data: null, message: '注册处理出错，请重试' };
      }
    },

    /**
     * 验证注册第一步：基本信息
     * @param {Object} data
     * @returns {{ valid: boolean, data: Object|null, message: string }}
     */
    validateRegisterStep1: function (data) {
      try {
        if (!data) {
          return { valid: false, data: null, message: '请填写基本信息' };
        }

        var name = (data.name || '').trim();
        var gender = (data.gender || '').trim();
        var birthDate = (data.birthDate || '').trim();
        var phone = (data.phone || '').trim();
        var email = (data.email || '').trim();
        var password = (data.password || '').trim();
        var confirmPassword = (data.confirmPassword || '').trim();
        var province = (data.province || '').trim();
        var city = (data.city || '').trim();

        // 姓名验证
        if (!name) {
          return { valid: false, data: null, message: '请输入您的姓名' };
        }
        if (name.length < 2) {
          return { valid: false, data: null, message: '姓名至少2个字符' };
        }
        if (name.length > 20) {
          return { valid: false, data: null, message: '姓名不能超过20个字符' };
        }

        // 性别验证
        if (!gender || (gender !== '男' && gender !== '女')) {
          return { valid: false, data: null, message: '请选择性别' };
        }

        // 出生日期验证
        if (!birthDate) {
          return { valid: false, data: null, message: '请选择出生日期' };
        }
        var age = calculateAge(birthDate);
        if (age === null) {
          return { valid: false, data: null, message: '出生日期格式不正确' };
        }
        if (age < 25) {
          return { valid: false, data: null, message: '您还未满25岁，本网站专为中年人士服务' };
        }
        if (age > 75) {
          return { valid: false, data: null, message: '请输入有效的出生日期' };
        }

        // 手机号验证（至少需要手机号或邮箱之一）
        if (!phone && !email) {
          return { valid: false, data: null, message: '请至少填写手机号或邮箱' };
        }
        if (phone && !isValidPhone(phone)) {
          return { valid: false, data: null, message: '请输入正确的手机号格式（11位手机号码）' };
        }
        if (email && !isValidEmail(email)) {
          return { valid: false, data: null, message: '请输入正确的邮箱格式' };
        }

        // 检查手机号是否已注册
        if (phone && Store.getUserByPhone(phone)) {
          return { valid: false, data: null, message: '该手机号已被注册，请直接登录' };
        }
        // 检查邮箱是否已注册
        if (email && Store.getUserByEmail(email)) {
          return { valid: false, data: null, message: '该邮箱已被注册，请直接登录' };
        }

        // 密码验证
        if (!password) {
          return { valid: false, data: null, message: '请设置密码' };
        }
        if (password.length < 6) {
          return { valid: false, data: null, message: '密码长度不能少于6位' };
        }
        if (password.length > 32) {
          return { valid: false, data: null, message: '密码长度不能超过32位' };
        }

        // 确认密码
        if (password !== confirmPassword) {
          return { valid: false, data: null, message: '两次输入的密码不一致' };
        }

        // 地区验证
        if (!province) {
          return { valid: false, data: null, message: '请选择所在省份' };
        }
        if (!city) {
          return { valid: false, data: null, message: '请选择所在城市' };
        }

        return {
          valid: true,
          data: {
            name: name,
            gender: gender,
            birthDate: birthDate,
            phone: phone,
            email: email,
            password: password,
            location: {
              province: province,
              city: city,
              district: (data.district || '').trim()
            }
          },
          message: ''
        };
      } catch (e) {
        console.error('validateRegisterStep1 error:', e);
        return { valid: false, data: null, message: '验证出错，请重试' };
      }
    },

    /**
     * 验证注册第二步：个人详情
     * @param {Object} data
     * @returns {{ valid: boolean, data: Object|null, message: string }}
     */
    validateRegisterStep2: function (data) {
      try {
        if (!data) {
          return { valid: false, data: null, message: '请填写个人详情' };
        }

        var height = data.height ? parseFloat(data.height) : null;
        var weight = data.weight ? parseFloat(data.weight) : null;
        var education = (data.education || '').trim();
        var occupation = (data.occupation || '').trim();
        var income = (data.income || data.incomeRange || '').trim();
        var maritalStatus = (data.maritalStatus || '').trim();
        var hasChildren = data.hasChildren;
        var selfIntro = (data.selfIntro || '').trim();
        var hobbies = data.hobbies || '';
        var personality = data.personality || '';

        // 身高验证
        if (height !== null && height !== undefined && !isNaN(height)) {
          if (height < 130 || height > 220) {
            return { valid: false, data: null, message: '请输入合理的身高范围（130-220厘米）' };
          }
        }

        // 体重验证
        if (weight !== null && weight !== undefined && !isNaN(weight)) {
          if (weight < 30 || weight > 200) {
            return { valid: false, data: null, message: '请输入合理的体重范围（30-200公斤）' };
          }
        }

        // 学历验证
        var validEducations = ['高中及以下', '中专', '大专', '本科', '硕士', '博士', '不限'];
        if (education && validEducations.indexOf(education) === -1) {
          // 也允许自定义
        }

        // 职业验证
        if (occupation && occupation.length > 30) {
          return { valid: false, data: null, message: '职业信息不能超过30个字符' };
        }

        // 收入验证
        var validIncomes = ['3000以下', '3000-5000', '5000-8000', '8000-10000', '10000-15000',
                            '15000-20000', '20000以上', '不限'];
        if (income && validIncomes.indexOf(income) === -1) {
          // 也允许自定义收入描述
        }

        // 婚姻状况验证
        var validMarital = ['未婚', '离异', '丧偶', '不限'];
        if (!maritalStatus) {
          return { valid: false, data: null, message: '请选择婚姻状况' };
        }
        if (validMarital.indexOf(maritalStatus) === -1) {
          return { valid: false, data: null, message: '请选择有效的婚姻状况' };
        }

        // 子女情况
        if (hasChildren === undefined || hasChildren === null || hasChildren === '') {
          // 允许不填
        } else {
          if (typeof hasChildren === 'string') {
            hasChildren = hasChildren === 'true' || hasChildren === '是' || hasChildren === 'yes';
          }
        }

        // 自我简介验证
        if (selfIntro && selfIntro.length > 500) {
          return { valid: false, data: null, message: '自我介绍不能超过500个字符' };
        }
        if (selfIntro && selfIntro.length < 10) {
          return { valid: false, data: null, message: '自我介绍至少10个字符，让更多人了解您' };
        }

        // 兴趣爱好处理
        var hobbyList = [];
        if (hobbies) {
          if (typeof hobbies === 'string') {
            hobbyList = hobbies.split(',').map(function (h) { return h.trim(); }).filter(function (h) { return h; });
          } else if (Array.isArray(hobbies)) {
            hobbyList = hobbies.map(function (h) { return (typeof h === 'string') ? h.trim() : ''; }).filter(function (h) { return h; });
          }
        }

        // 性格特征处理
        var personalityList = [];
        if (personality) {
          if (typeof personality === 'string') {
            personalityList = personality.split(',').map(function (p) { return p.trim(); }).filter(function (p) { return p; });
          } else if (Array.isArray(personality)) {
            personalityList = personality.map(function (p) { return (typeof p === 'string') ? p.trim() : ''; }).filter(function (p) { return p; });
          }
        }

        return {
          valid: true,
          data: {
            height: height,
            weight: weight,
            education: education,
            occupation: occupation,
            income: income,
            incomeRange: income,
            maritalStatus: maritalStatus,
            hasChildren: !!hasChildren,
            childrenDetails: (data.childrenDetails || '').trim(),
            hobbies: hobbyList,
            personality: personalityList,
            selfIntro: selfIntro
          },
          message: ''
        };
      } catch (e) {
        console.error('validateRegisterStep2 error:', e);
        return { valid: false, data: null, message: '验证出错，请重试' };
      }
    },

    /**
     * 验证注册第三步：择偶偏好
     * @param {Object} data
     * @returns {{ valid: boolean, data: Object|null, message: string }}
     */
    validateRegisterStep3: function (data) {
      try {
        if (!data) {
          return { valid: false, data: null, message: '请填写择偶偏好' };
        }

        var partnerAgeMin = data.partnerAgeMin ? parseInt(data.partnerAgeMin, 10) : null;
        var partnerAgeMax = data.partnerAgeMax ? parseInt(data.partnerAgeMax, 10) : null;
        var partnerEducation = (data.partnerEducation || '').trim();
        var partnerIncome = (data.partnerIncome || '').trim();
        var partnerRequirements = (data.partnerRequirements || '').trim();

        // 年龄范围验证
        if (partnerAgeMin !== null && (isNaN(partnerAgeMin) || partnerAgeMin < 25 || partnerAgeMin > 80)) {
          return { valid: false, data: null, message: '请设置合理的对方最小年龄（25-80岁）' };
        }
        if (partnerAgeMax !== null && (isNaN(partnerAgeMax) || partnerAgeMax < 25 || partnerAgeMax > 80)) {
          return { valid: false, data: null, message: '请设置合理的对方最大年龄（25-80岁）' };
        }
        if (partnerAgeMin !== null && partnerAgeMax !== null && partnerAgeMin > partnerAgeMax) {
          return { valid: false, data: null, message: '对方最小年龄不能大于最大年龄' };
        }

        // 择偶要求验证
        if (partnerRequirements && partnerRequirements.length > 300) {
          return { valid: false, data: null, message: '择偶要求不能超过300个字符' };
        }

        return {
          valid: true,
          data: {
            partnerAgeMin: partnerAgeMin,
            partnerAgeMax: partnerAgeMax,
            partnerEducation: partnerEducation,
            partnerIncome: partnerIncome,
            partnerRequirements: partnerRequirements,
            partnerMaritalPref: (data.partnerMaritalPref || '').trim(),
            avatar: (data.avatar || '').trim()
          },
          message: ''
        };
      } catch (e) {
        console.error('validateRegisterStep3 error:', e);
        return { valid: false, data: null, message: '验证出错，请重试' };
      }
    },

    /**
     * 完成注册（合并三步数据并创建用户）
     * @param {Object} step3Data - 第三步的表单数据
     * @returns {{ valid: boolean, data: Object|null, message: string }}
     * @private
     */
    _completeRegistration: function (step3Data) {
      try {
        // 从 sessionStorage 获取前两步的数据
        var step1Data = storageGet('dating_reg_step1', null);
        var step2Data = storageGet('dating_reg_step2', null);

        if (!step1Data) {
          return { valid: false, data: null, message: '注册信息已过期，请重新开始注册' };
        }
        if (!step2Data) {
          return { valid: false, data: null, message: '注册信息已过期，请重新开始注册' };
        }

        // 合并所有数据
        var fullData = {};
        // 第一步数据
        for (var key in step1Data) {
          if (step1Data.hasOwnProperty(key)) {
            fullData[key] = step1Data[key];
          }
        }
        // 第二步数据
        for (var key in step2Data) {
          if (step2Data.hasOwnProperty(key)) {
            fullData[key] = step2Data[key];
          }
        }
        // 第三步数据
        for (var key in step3Data) {
          if (step3Data.hasOwnProperty(key)) {
            fullData[key] = step3Data[key];
          }
        }

        // 调用 Store.register
        var result = Store.register(fullData);

        if (result.success) {
          currentUser = result.user;
          window.currentUser = result.user;
          // 清除临时数据
          storageRemove('dating_reg_step1');
          storageRemove('dating_reg_step2');
        }

        return { valid: result.success, data: result.user, message: result.message };
      } catch (e) {
        console.error('_completeRegistration error:', e);
        return { valid: false, data: null, message: '注册完成处理出错，请重试' };
      }
    },

    /**
     * 保存注册步骤数据到临时存储
     * @param {number} step - 步骤号
     * @param {Object} data - 该步骤的数据
     */
    saveRegisterStep: function (step, data) {
      try {
        if (step === 1) {
          storageSet('dating_reg_step1', data);
        } else if (step === 2) {
          storageSet('dating_reg_step2', data);
        }
      } catch (e) {
        console.error('saveRegisterStep error:', e);
      }
    },

    // =========================================================================
    // 退出登录
    // =========================================================================

    /**
     * 退出登录
     */
    logout: function () {
      try {
        Store.logout();
        currentUser = null;
        window.currentUser = null;
        showToast('您已安全退出', 'info');
        setTimeout(function () {
          window.location.href = 'index.html';
        }, 500);
      } catch (e) {
        console.error('logout error:', e);
        // 即使出错也强制跳转
        window.location.href = 'index.html';
      }
    },

    // =========================================================================
    // 身份验证守卫
    // =========================================================================

    /**
     * 检查用户是否已登录，未登录则跳转到登录页
     * @param {string} redirectTo - 登录后返回的页面，默认为当前页面
     */
    requireAuth: function (redirectTo) {
      try {
        if (!Store.isLoggedIn()) {
          var target = redirectTo || window.location.href;
          var encoded = encodeURIComponent(target);
          window.location.href = 'login.html?redirect=' + encoded;
          return false;
        }
        // 刷新全局变量
        currentUser = Store.getCurrentUser();
        window.currentUser = currentUser;
        return true;
      } catch (e) {
        console.error('requireAuth error:', e);
        window.location.href = 'login.html';
        return false;
      }
    },

    /**
     * 如果已登录则跳转到首页（用于登录/注册页面）
     */
    redirectIfAuth: function () {
      try {
        if (Store.isLoggedIn()) {
          window.location.href = 'dashboard.html';
          return true;
        }
        return false;
      } catch (e) {
        console.error('redirectIfAuth error:', e);
        return false;
      }
    },

    // =========================================================================
    // 初始化
    // =========================================================================

    /**
     * 初始化认证模块
     * 恢复当前用户状态
     */
    init: function () {
      try {
        currentUser = Store.getCurrentUser();
        window.currentUser = currentUser;

        // 设置自动登出（可选：30分钟无操作自动退出）
        this._setupAutoLogout();

        console.log('👤 认证模块就绪' + (currentUser ? ('，当前用户：' + currentUser.name) : '，未登录'));
      } catch (e) {
        console.error('Auth.init error:', e);
      }
    },

    /**
     * 设置自动登出（30分钟无操作）
     * @private
     */
    _autoLogoutTimer: null,
    _autoLogoutTimeout: 30 * 60 * 1000, // 30分钟

    _setupAutoLogout: function () {
      var self = this;

      function resetTimer() {
        if (self._autoLogoutTimer) {
          clearTimeout(self._autoLogoutTimer);
        }
        if (Store.isLoggedIn()) {
          self._autoLogoutTimer = setTimeout(function () {
            Store.logout();
            currentUser = null;
            window.currentUser = null;
            showToast('长时间未操作，已自动退出登录', 'warning', 5000);
            setTimeout(function () {
              window.location.href = 'index.html';
            }, 2000);
          }, self._autoLogoutTimeout);
        }
      }

      // 监听用户活动
      var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      for (var i = 0; i < events.length; i++) {
        document.addEventListener(events[i], resetTimer, { passive: true });
      }

      // 初始设置
      resetTimer();
    },

    /**
     * 取消自动登出
     */
    cancelAutoLogout: function () {
      if (this._autoLogoutTimer) {
        clearTimeout(this._autoLogoutTimer);
        this._autoLogoutTimer = null;
      }
    }
  };

  // 挂载到全局
  window.Auth = Auth;
  window.currentUser = currentUser;

  console.log('✅ auth.js 已加载 - 身份验证模块就绪');
})();
