/**
 * 相亲网站 Seed Data — 中年相亲交友平台初始数据
 * 供 Store.init() 首次运行时通过 SeedData.load() 灌入 localStorage
 */

window.SEED_DATA = (function () {
  'use strict';

  // ── 辅助函数 ────────────────────────────────────────────────
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pickN(arr, n) {
    var seen = {};
    var result = [];
    while (result.length < n && result.length < arr.length) {
      var idx = Math.floor(Math.random() * arr.length);
      if (!seen[idx]) {
        seen[idx] = true;
        result.push(arr[idx]);
      }
    }
    return result;
  }

  function iso(month, day, hour) {
    return '2026-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0') + 'T' + String(hour || 8).padStart(2, '0') + ':00:00.000Z';
  }

  var now = '2026-06-20T08:00:00.000Z';

  // ═══════════════════════════════════════════════════════════
  //  1. USERS
  // ═══════════════════════════════════════════════════════════
  var USERS = [];

  var userDefs = [
    // id, email, phone, role, name  (role default 'user')
    { id: 'u_admin', email: 'admin@example.com', phone: '13900000000', role: 'admin', name: '管理员' },
    // Male users
    { id: 'u_001', email: 'wangjianguo@example.com', phone: '13800138001', name: '王建国' },
    { id: 'u_002', email: 'lizhiming@example.com', phone: '13800138002', name: '李志明' },
    { id: 'u_003', email: 'zhangdehua@example.com', phone: '13800138003', name: '张德厚' },
    { id: 'u_004', email: 'liuhaoran@example.com', phone: '13800138004', name: '刘浩然' },
    { id: 'u_005', email: 'chenguoqiang@example.com', phone: '13800138005', name: '陈国强' },
    { id: 'u_006', email: 'zhaoyonggang@example.com', phone: '13800138006', name: '赵永刚' },
    { id: 'u_007', email: 'sunwenbin@example.com', phone: '13800138007', name: '孙文斌' },
    { id: 'u_008', email: 'zhoujianping@example.com', phone: '13800138008', name: '周建平' },
    { id: 'u_009', email: 'wuyunlong@example.com', phone: '13800138009', name: '吴云龙' },
    { id: 'u_010', email: 'zhengguanghui@example.com', phone: '13800138010', name: '郑光辉' },
    { id: 'u_011', email: 'huchangqing@example.com', phone: '13800138011', name: '胡长青' },
    { id: 'u_012', email: 'zhumingyuan@example.com', phone: '13800138012', name: '朱明远' },
    { id: 'u_013', email: 'maxiaofeng@example.com', phone: '13800138013', name: '马晓峰' },
    { id: 'u_014', email: 'huangzhiqiang@example.com', phone: '13800138014', name: '黄志强' },
    { id: 'u_015', email: 'linwentao@example.com', phone: '13800138015', name: '林文涛' },
    // Female users
    { id: 'u_016', email: 'yanlihua@example.com', phone: '13900139001', name: '严丽华' },
    { id: 'u_017', email: 'xumeirong@example.com', phone: '13900139002', name: '许美蓉' },
    { id: 'u_018', email: 'caixiaoying@example.com', phone: '13900139003', name: '蔡晓英' },
    { id: 'u_019', email: 'fengxiumei@example.com', phone: '13900139004', name: '冯秀梅' },
    { id: 'u_020', email: 'hefang@example.com', phone: '13900139005', name: '何芳' },
    { id: 'u_021', email: 'shenqiuyue@example.com', phone: '13900139006', name: '沈秋月' },
    { id: 'u_022', email: 'tangyulan@example.com', phone: '13900139007', name: '唐玉兰' },
    { id: 'u_023', email: 'hanchunhua@example.com', phone: '13900139008', name: '韩春华' },
    { id: 'u_024', email: 'qianhaili@example.com', phone: '13900139009', name: '钱海丽' },
    { id: 'u_025', email: 'songcuiping@example.com', phone: '13900139010', name: '宋翠萍' },
    { id: 'u_026', email: 'jiangshuhong@example.com', phone: '13900139011', name: '蒋淑红' },
    { id: 'u_027', email: 'songjianfen@example.com', phone: '13900139012', name: '宋建芬' },
    { id: 'u_028', email: 'dengxiangyun@example.com', phone: '13900139013', name: '邓香云' },
    { id: 'u_029', email: 'panyuemei@example.com', phone: '13900139014', name: '潘月梅' },
    { id: 'u_030', email: 'fangliqin@example.com', phone: '13900139015', name: '方丽琴' },
    { id: 'u_031', email: 'xiaohong@example.com', phone: '13900139016', name: '肖红' },
    { id: 'u_032', email: 'yaosuling@example.com', phone: '13900139017', name: '姚素玲' },
    { id: 'u_033', email: 'duanshufen@example.com', phone: '13900139018', name: '段淑芬' }
  ];

  userDefs.forEach(function (d) {
    var createdMonth = randInt(3, 5);
    var createdDay = randInt(1, 28);
    var loginDay = randInt(10, 20);
    USERS.push({
      id: d.id,
      email: d.email,
      phone: d.phone,
      password: '123456',
      role: d.role || 'user',
      isActive: true,
      isVerified: d.role === 'admin' ? true : Math.random() > 0.3,
      lastLoginAt: iso(6, loginDay, randInt(6, 22)),
      createdAt: iso(createdMonth, createdDay, 10),
      updatedAt: iso(6, randInt(1, 20), 9)
    });
  });

  // ═══════════════════════════════════════════════════════════
  //  2. PROFILES
  // ═══════════════════════════════════════════════════════════
  var PROFILES = [];

  var profileDefs = [
    // ── 男嘉宾 ──────────────────────────────────────────
    {
      id: 'p_001', userId: 'u_001', displayName: '王建国', gender: 'male', birthDate: '1962-08-15',
      height: 172, weight: 75, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'college', occupation: '退休教师', incomeRange: '5000-8000',
      province: '北京市', city: '北京', district: '海淀区',
      hobbies: ['太极拳', '书法', '读书', '旅游', '养生保健'],
      personalityTags: ['稳重', '开朗', '体贴'],
      selfIntro: '退休中学语文教师，性格温和，生活规律。每天早起打太极拳，下午练字看书。儿女已成家立业，没有负担。希望找一个能一起散步聊天、共享晚年的伴侣，平平淡淡才是真。',
      partnerAgeMin: 55, partnerAgeMax: 68, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '3000-5000',
      partnerRequirements: '身体健康，性格温和，喜欢安静的生活方式，最好也在北京。',
      avatarPhotoId: 'photo_001', profileCompleteness: 92
    },
    {
      id: 'p_002', userId: 'u_002', displayName: '李志明', gender: 'male', birthDate: '1970-03-22',
      height: 178, weight: 82, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'with_ex',
      education: 'bachelor', occupation: '企业经理', incomeRange: '12000-20000',
      province: '上海市', city: '上海', district: '浦东新区',
      hobbies: ['羽毛球', '骑行', '摄影', '投资理财'],
      personalityTags: ['成熟', '幽默', '独立'],
      selfIntro: '上海本地人，在一家贸易公司做部门经理。离婚五年，女儿跟前妻生活，周末偶尔接来。工作虽忙但懂得享受生活，周末喜欢骑行拍照。为人真诚直接，不拐弯抹角。希望找一个聊得来的伴侣，互相陪伴下半生。',
      partnerAgeMin: 40, partnerAgeMax: 55, partnerEducation: ['college', 'bachelor', 'master'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '5000-8000',
      partnerRequirements: '上海或周边，性格开朗大方，有自己独立的生活圈子和兴趣爱好，不黏人。',
      avatarPhotoId: 'photo_002', profileCompleteness: 85
    },
    {
      id: 'p_003', userId: 'u_003', displayName: '张德厚', gender: 'male', birthDate: '1958-11-08',
      height: 170, weight: 70, maritalStatus: 'widowed', hasChildren: true, childrenLivingWith: 'independent',
      education: 'high_school', occupation: '退休干部', incomeRange: '8000-12000',
      province: '广东省', city: '广州', district: '越秀区',
      hobbies: ['太极拳', '棋牌', '散步', '养花', '养生保健'],
      personalityTags: ['稳重', '细心', '顾家'],
      selfIntro: '退休前在机关单位工作，作风正派，为人本分。老伴三年前因病去世，两个儿子都在外地工作安家。一个人住在越秀老城区，每天去公园下棋散步。不抽烟不喝酒，生活朴素。想找个性格合得来的老伴，相互照应。',
      partnerAgeMin: 55, partnerAgeMax: 70, partnerEducation: ['high_school', 'college'],
      partnerMaritalStatus: ['widowed', 'divorced'], partnerIncomeMin: '3000-5000',
      partnerRequirements: '心地善良，能接受平淡的退休生活，最好在广州，方便走动。',
      avatarPhotoId: 'photo_003', profileCompleteness: 90
    },
    {
      id: 'p_004', userId: 'u_004', displayName: '刘浩然', gender: 'male', birthDate: '1975-06-30',
      height: 180, weight: 85, maritalStatus: 'single', hasChildren: false, childrenLivingWith: null,
      education: 'master', occupation: '工程师', incomeRange: 'above_20000',
      province: '广东省', city: '深圳', district: '南山区',
      hobbies: ['游泳', '登山', '读书', '电脑', '投资理财'],
      personalityTags: ['成熟', '真诚', '独立', '乐观'],
      selfIntro: 'IT行业高级工程师，在深圳工作二十多年了。因为年轻时专注事业，错过了婚恋的黄金年龄。现在经济条件不错，有房有车无贷。性格独立稳重，喜欢户外运动。想找一位有共同语言、能互相欣赏的伴侣，年龄不是问题，重要的是心灵契合。',
      partnerAgeMin: 38, partnerAgeMax: 50, partnerEducation: ['bachelor', 'master', 'doctor'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '8000-12000',
      partnerRequirements: '有文化素养，有自己追求的事业或爱好，不物质，看重精神交流。',
      avatarPhotoId: 'photo_004', profileCompleteness: 88
    },
    {
      id: 'p_005', userId: 'u_005', displayName: '陈国强', gender: 'male', birthDate: '1965-01-20',
      height: 174, weight: 76, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'college', occupation: '公务员', incomeRange: '8000-12000',
      province: '四川省', city: '成都', district: '武侯区',
      hobbies: ['乒乓球', '烹饪', '旅游', '棋牌'],
      personalityTags: ['开朗', '大方', '幽默'],
      selfIntro: '在政府部门工作三十年了，为人正派，性格开朗。儿子已经工作，不用操心。平时喜欢做饭，川菜手艺还不错。周末常约朋友打乒乓球或自驾出游。生活态度积极乐观，觉得人到中年更要好好享受生活。希望能找到一个开朗大方的女士，一起吃喝玩乐，享受人生。',
      partnerAgeMin: 50, partnerAgeMax: 62, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed', 'single'], partnerIncomeMin: '3000-5000',
      partnerRequirements: '性格好，喜欢美食和旅游，能接受成都的生活节奏。最好是四川人，饮食习惯一致。',
      avatarPhotoId: 'photo_005', profileCompleteness: 95
    },
    {
      id: 'p_006', userId: 'u_006', displayName: '赵永刚', gender: 'male', birthDate: '1972-09-12',
      height: 176, weight: 78, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'bachelor', occupation: '医生', incomeRange: '12000-20000',
      province: '浙江省', city: '杭州', district: '西湖区',
      hobbies: ['游泳', '书法', '摄影', '乐器', '读书'],
      personalityTags: ['稳重', '细心', '体贴'],
      selfIntro: '三甲医院内科副主任医师，工作稳定但不算太忙。离婚十年，女儿在国外留学。平时生活规律，喜欢书法和古典音乐，也会拉二胡。性格温和有耐心，可能是职业习惯吧。希望能找到一位有共同兴趣爱好的女士，相濡以沫。',
      partnerAgeMin: 45, partnerAgeMax: 58, partnerEducation: ['college', 'bachelor', 'master'],
      partnerMaritalStatus: ['single', 'divorced', 'widowed'], partnerIncomeMin: '5000-8000',
      partnerRequirements: '温柔善良，有耐心，能理解医生的工作性质。最好是杭州本地或周边。',
      avatarPhotoId: 'photo_006', profileCompleteness: 91
    },
    {
      id: 'p_007', userId: 'u_007', displayName: '孙文斌', gender: 'male', birthDate: '1968-04-05',
      height: 175, weight: 73, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'with_ex',
      education: 'college', occupation: '个体户', incomeRange: '5000-8000',
      province: '江苏省', city: '南京', district: '鼓楼区',
      hobbies: ['钓鱼', '棋牌', '散步', '烹饪'],
      personalityTags: ['随和', '勤劳', '真诚'],
      selfIntro: '在南京开了二十多年的小超市，生意稳定。为人老实本分，不抽烟不喝酒不打牌（除了偶尔和朋友下下象棋）。一个人生活久了，虽然自由但也孤单。想找个踏实的伴儿，互相有个照应，平平淡淡过日子。',
      partnerAgeMin: 50, partnerAgeMax: 65, partnerEducation: ['high_school', 'college'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: 'below_3000',
      partnerRequirements: '踏实过日子的女性，不嫌弃做小生意的，能一起操持家务。',
      avatarPhotoId: 'photo_007', profileCompleteness: 78
    },
    {
      id: 'p_008', userId: 'u_008', displayName: '周建平', gender: 'male', birthDate: '1960-07-18',
      height: 168, weight: 68, maritalStatus: 'widowed', hasChildren: true, childrenLivingWith: 'independent',
      education: 'high_school', occupation: '退休工人', incomeRange: '3000-5000',
      province: '湖北省', city: '武汉', district: '武昌区',
      hobbies: ['太极拳', '散步', '养花', '戏曲', '棋牌'],
      personalityTags: ['老实', '善良', '稳重'],
      selfIntro: '武钢退休工人，在武昌生活了一辈子。老伴五年前走了，两个女儿都已出嫁。现在一个人住在老房子里，每天早上去公园锻炼，下午听听戏。身体还算硬朗，就是觉得一个人太冷清。想找个能说说话、一起买菜做饭的老伴。',
      partnerAgeMin: 58, partnerAgeMax: 72, partnerEducation: ['high_school', 'college'],
      partnerMaritalStatus: ['widowed', 'divorced'], partnerIncomeMin: 'below_3000',
      partnerRequirements: '身体健康，不图钱，真心想搭伙过日子的。武汉本地人最好。',
      avatarPhotoId: 'photo_008', profileCompleteness: 75
    },
    {
      id: 'p_009', userId: 'u_009', displayName: '吴云龙', gender: 'male', birthDate: '1974-12-25',
      height: 182, weight: 88, maritalStatus: 'single', hasChildren: false, childrenLivingWith: null,
      education: 'bachelor', occupation: '企业经理', incomeRange: 'above_20000',
      province: '重庆市', city: '重庆', district: '渝北区',
      hobbies: ['登山', '旅游', '摄影', '骑行', '烹饪'],
      personalityTags: ['开朗', '幽默', '大方', '乐观'],
      selfIntro: '重庆本地人，自己开了个商贸公司，经济条件还不错。一直没有结过婚，不是眼光高，主要是年轻时候忙事业，后来又挑挑拣拣就耽误了。性格开朗外向，喜欢运动和旅游，去过二十多个国家。现在想稳定下来，找个喜欢的人一起享受生活。',
      partnerAgeMin: 38, partnerAgeMax: 52, partnerEducation: ['bachelor', 'master'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '5000-8000',
      partnerRequirements: '开朗乐观，喜欢旅游，能接受出差多的工作节奏。相貌端正加分。',
      avatarPhotoId: 'photo_009', profileCompleteness: 86
    },
    {
      id: 'p_010', userId: 'u_010', displayName: '郑光辉', gender: 'male', birthDate: '1967-02-14',
      height: 173, weight: 74, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'with_ex',
      education: 'bachelor', occupation: '会计', incomeRange: '8000-12000',
      province: '陕西省', city: '西安', district: '雁塔区',
      hobbies: ['读书', '书法', '摄影', '旅游', '养生保健'],
      personalityTags: ['细心', '稳重', '真诚'],
      selfIntro: '在一家国企做财务主管，工作稳定。离婚八年了，前妻带着孩子在南方生活。平时话不多但为人实在，喜欢安静的生活。周末要么在家看书练字，要么去周边古迹走走拍拍。想找一位温柔的女士，不需要多有钱，关键是性格好、心地善良。',
      partnerAgeMin: 48, partnerAgeMax: 60, partnerEducation: ['college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '3000-5000',
      partnerRequirements: '性格温柔，有共同话题，最好是西安本地人，异地太折腾。',
      avatarPhotoId: 'photo_010', profileCompleteness: 83
    },
    {
      id: 'p_011', userId: 'u_011', displayName: '胡长青', gender: 'male', birthDate: '1959-10-01',
      height: 171, weight: 69, maritalStatus: 'widowed', hasChildren: true, childrenLivingWith: 'independent',
      education: 'college', occupation: '退休教师', incomeRange: '5000-8000',
      province: '山东省', city: '青岛', district: '市南区',
      hobbies: ['太极拳', '游泳', '国画', '养花'],
      personalityTags: ['温和', '细心', '善良'],
      selfIntro: '退休前是中学美术教师，画了一辈子国画。现在退休了，每天依然坚持画画，偶尔去海边游泳。住在青岛老城区，生活便利，海风宜人。性格温和不争，喜欢恬淡的生活。想找一位同样喜欢安静、有艺术爱好的老伴。',
      partnerAgeMin: 60, partnerAgeMax: 73, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['widowed'], partnerIncomeMin: '3000-5000',
      partnerRequirements: '温和善良，最好也喜欢画画或者有艺术爱好。青岛本地或山东人优先。',
      avatarPhotoId: 'photo_011', profileCompleteness: 89
    },
    {
      id: 'p_012', userId: 'u_012', displayName: '朱明远', gender: 'male', birthDate: '1971-05-20',
      height: 177, weight: 80, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'with_me',
      education: 'doctor', occupation: '大学教授', incomeRange: '12000-20000',
      province: '湖北省', city: '武汉', district: '洪山区',
      hobbies: ['读书', '书法', '登山', '摄影', '乐器'],
      personalityTags: ['成熟', '稳重', '真诚', '独立'],
      selfIntro: '武汉某高校经济学教授，平时上课带研究生，偶尔做做企业咨询。离婚后儿子跟我生活，现在上高中了，很懂事。我性格比较理性但不失温情，生活自理能力强。希望能找到一位知书达理的女士，能够互相理解和支持，携手共度余生。',
      partnerAgeMin: 42, partnerAgeMax: 55, partnerEducation: ['bachelor', 'master', 'doctor'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '8000-12000',
      partnerRequirements: '有知识有涵养，能接受我有孩子同住的情况。最好在武汉，不想异地。',
      avatarPhotoId: 'photo_012', profileCompleteness: 93
    },
    {
      id: 'p_013', userId: 'u_013', displayName: '马晓峰', gender: 'male', birthDate: '1976-08-08',
      height: 179, weight: 83, maritalStatus: 'single', hasChildren: false, childrenLivingWith: null,
      education: 'bachelor', occupation: '自由职业', incomeRange: '8000-12000',
      province: '云南省', city: '大理', district: '大理市',
      hobbies: ['摄影', '旅游', '烹饪', '乐器', '读书'],
      personalityTags: ['开朗', '随和', '浪漫', '乐观'],
      selfIntro: '北京人，但前几年搬到了大理生活。以前在互联网公司做设计，现在自由职业，开了一个小民宿。喜欢摄影和音乐，会弹吉他。性格比较洒脱，不喜欢太拘束的生活。想找一个能和我一起看云卷云舒、感受生活美好的人。',
      partnerAgeMin: 38, partnerAgeMax: 50, partnerEducation: ['bachelor', 'master'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '5000-8000',
      partnerRequirements: '热爱生活，有艺术气质，能接受大理的慢生活节奏。不要太物质化。',
      avatarPhotoId: 'photo_013', profileCompleteness: 80
    },
    {
      id: 'p_014', userId: 'u_014', displayName: '黄志强', gender: 'male', birthDate: '1964-06-06',
      height: 175, weight: 77, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'college', occupation: '公务员', incomeRange: '8000-12000',
      province: '辽宁省', city: '大连', district: '中山区',
      hobbies: ['游泳', '散步', '棋牌', '钓鱼', '烹饪'],
      personalityTags: ['稳重', '顾家', '大方'],
      selfIntro: '在大连某局工作，再过几年就退休了。离婚也有十来年了，孩子在上海工作。一个人住惯了，但年纪越大越觉得需要个伴。平时喜欢做点海鲜，海边散散步。为人实在，说话算数。想找一位懂生活的女士，一起做饭、聊天、散步。',
      partnerAgeMin: 52, partnerAgeMax: 65, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '3000-5000',
      partnerRequirements: '性格好，喜欢海边城市，愿意来大连生活。',
      avatarPhotoId: 'photo_014', profileCompleteness: 82
    },
    {
      id: 'p_015', userId: 'u_015', displayName: '林文涛', gender: 'male', birthDate: '1969-11-28',
      height: 176, weight: 72, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'master', occupation: '律师', incomeRange: 'above_20000',
      province: '福建省', city: '厦门', district: '思明区',
      hobbies: ['游泳', '读书', '旅游', '投资理财'],
      personalityTags: ['成熟', '稳重', '真诚', '细腻'],
      selfIntro: '在厦门做律师二十多年了，有自己的事务所。离婚后儿子已经工作自立。平时比较忙但会合理安排时间，喜欢安静的生活。周末去游泳、看书，长假出国旅行。性格理性周到，但在感情上还是比较感性的。想找一位温柔知性的女士，一起经营温馨的家庭。',
      partnerAgeMin: 42, partnerAgeMax: 55, partnerEducation: ['bachelor', 'master', 'doctor'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '8000-12000',
      partnerRequirements: '知性温柔，有生活品味，最好在福建或华东地区，异地太累。',
      avatarPhotoId: 'photo_015', profileCompleteness: 90
    },
    // ── 女嘉宾 ──────────────────────────────────────────
    {
      id: 'p_016', userId: 'u_016', displayName: '严丽华', gender: 'female', birthDate: '1965-11-20',
      height: 162, weight: 58, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'with_ex',
      education: 'college', occupation: '退休护士', incomeRange: '5000-8000',
      province: '北京市', city: '北京', district: '朝阳区',
      hobbies: ['广场舞', '烹饪', '旅游', '养生保健', '读书'],
      personalityTags: ['温柔', '顾家', '善良'],
      selfIntro: '北京本地人，退休护士，有医保有退休金，没有经济负担。儿子跟前夫生活，已经工作。性格温和，热心肠，喜欢照顾人。退休后报了老年大学，学烹饪和养生。一个人住朝阳区，房子虽不大但收拾得干净温馨。想找个能互相搀扶的老伴，一起慢慢变老。',
      partnerAgeMin: 58, partnerAgeMax: 70, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '5000-8000',
      partnerRequirements: '北京人或在北京定居，性格好不暴躁，身体健康，能一起散步逛公园。',
      avatarPhotoId: 'photo_016', profileCompleteness: 94
    },
    {
      id: 'p_017', userId: 'u_017', displayName: '许美蓉', gender: 'female', birthDate: '1972-04-08',
      height: 160, weight: 55, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'bachelor', occupation: '会计', incomeRange: '8000-12000',
      province: '上海市', city: '上海', district: '徐汇区',
      hobbies: ['瑜伽', '读书', '摄影', '旅游', '投资理财'],
      personalityTags: ['独立', '细心', '温柔'],
      selfIntro: '上海人，在一家外企做财务主管。离婚十年，女儿上大学了不在身边。工作之余喜欢看书旅行，每年都会安排两次出境游。生活精致但不奢靡，性格独立但不强势。觉得人到中年应该更懂得珍惜。想找一个和自己条件相当、能聊得来的男士，一起优雅地变老。',
      partnerAgeMin: 45, partnerAgeMax: 60, partnerEducation: ['bachelor', 'master', 'doctor'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '12000-20000',
      partnerRequirements: '上海或长三角地区，有稳定事业和经济基础，不抽烟，有生活品味。',
      avatarPhotoId: 'photo_017', profileCompleteness: 91
    },
    {
      id: 'p_018', userId: 'u_018', displayName: '蔡晓英', gender: 'female', birthDate: '1970-08-25',
      height: 158, weight: 54, maritalStatus: 'widowed', hasChildren: true, childrenLivingWith: 'independent',
      education: 'college', occupation: '个体工商户', incomeRange: '5000-8000',
      province: '广东省', city: '广州', district: '天河区',
      hobbies: ['羽毛球', '烹饪', '唱歌', '旅游'],
      personalityTags: ['开朗', '勤劳', '顾家'],
      selfIntro: '广东人，在天河开了一家小服装店，生意还过得去。老公十年前出车祸走了，一个人把儿子拉扯大，现在儿子在上海读研究生。性格比较外向，喜欢唱歌。虽然经历过苦日子，但一直保持乐观心态。想找一个善良稳重的男士，彼此温暖，共同度过下半生。',
      partnerAgeMin: 48, partnerAgeMax: 62, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '3000-5000',
      partnerRequirements: '广东人或在广东定居，善良可靠，不嫌弃我做小生意的。要能接受我有时忙。',
      avatarPhotoId: 'photo_018', profileCompleteness: 87
    },
    {
      id: 'p_019', userId: 'u_019', displayName: '冯秀梅', gender: 'female', birthDate: '1968-12-01',
      height: 161, weight: 56, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'bachelor', occupation: '教师', incomeRange: '8000-12000',
      province: '广东省', city: '深圳', district: '福田区',
      hobbies: ['读书', '书法', '国画', '旅游', '养生保健'],
      personalityTags: ['温柔', '善良', '稳重', '随和'],
      selfIntro: '在深圳一所中学教语文快三十年了，热爱教育也热爱生活。离婚后女儿跟我，现在她上大学住校了，一个人住反而觉得空落落的。喜欢传统文化，周末常去书画班学习。性格温和，不喜欢争吵。希望找一位有文化底蕴、脾气温和的男士，一起读书品茶，安度晚年。',
      partnerAgeMin: 50, partnerAgeMax: 65, partnerEducation: ['college', 'bachelor', 'master'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '5000-8000',
      partnerRequirements: '有文化，性格好，最好是深圳或广东的，生活习惯接近。',
      avatarPhotoId: 'photo_019', profileCompleteness: 92
    },
    {
      id: 'p_020', userId: 'u_020', displayName: '何芳', gender: 'female', birthDate: '1975-03-15',
      height: 165, weight: 52, maritalStatus: 'single', hasChildren: false, childrenLivingWith: null,
      education: 'master', occupation: '医生', incomeRange: '12000-20000',
      province: '浙江省', city: '杭州', district: '上城区',
      hobbies: ['游泳', '读书', '旅游', '瑜伽', '烹饪'],
      personalityTags: ['独立', '成熟', '温柔', '大方'],
      selfIntro: '杭州某三甲医院儿科副主任医师，因为工作忙碌加上早年比较挑剔，一直没有结婚。现在事业稳定了，开始认真考虑终身大事。性格虽然独立但并不强势，喜欢安静的生活。平时的休闲方式是游泳和读书，假期喜欢旅行。想找一位有趣的灵魂，不需要多有钱，但要有修养和格局。',
      partnerAgeMin: 42, partnerAgeMax: 55, partnerEducation: ['bachelor', 'master', 'doctor'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '12000-20000',
      partnerRequirements: '有学识有修养，尊重女性，能理解医生职业的忙碌。杭州或周边城市。',
      avatarPhotoId: 'photo_020', profileCompleteness: 95
    },
    {
      id: 'p_021', userId: 'u_021', displayName: '沈秋月', gender: 'female', birthDate: '1967-09-10',
      height: 159, weight: 57, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'high_school', occupation: '收银员', incomeRange: '3000-5000',
      province: '江苏省', city: '南京', district: '秦淮区',
      hobbies: ['广场舞', '散步', '养花', '唱歌'],
      personalityTags: ['勤劳', '善良', '随和'],
      selfIntro: '南京本地人，在超市做收银员，工作不算累但也充实。离婚后两个儿子跟了前夫，现在都工作了，关系还行。一个人住在秦淮老小区里，养了很多花。虽然没什么文化，但为人真诚善良。想找一个老实可靠的男人，不嫌我普通，一起过柴米油盐的小日子。',
      partnerAgeMin: 52, partnerAgeMax: 68, partnerEducation: ['high_school', 'college'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: 'below_3000',
      partnerRequirements: '老实可靠，能过日子就行。南京本地人优先，不接受异地。',
      avatarPhotoId: 'photo_021', profileCompleteness: 72
    },
    {
      id: 'p_022', userId: 'u_022', displayName: '唐玉兰', gender: 'female', birthDate: '1963-01-12',
      height: 157, weight: 55, maritalStatus: 'widowed', hasChildren: true, childrenLivingWith: 'independent',
      education: 'college', occupation: '退休教师', incomeRange: '5000-8000',
      province: '四川省', city: '成都', district: '锦江区',
      hobbies: ['太极拳', '国画', '旅游', '烹饪', '养生保健'],
      personalityTags: ['温柔', '顾家', '善良', '开朗'],
      selfIntro: '退休小学语文老师，在成都生活了大半辈子。老伴五年前因病走了，两个女儿都在成都，但各自有家庭。我喜欢画国画，是老年大学国画班的班长。性格开朗温和，喜欢和人交流。想找一个谈得来的老伴，一起喝茶逛公园，把晚年过得有滋有味。',
      partnerAgeMin: 60, partnerAgeMax: 73, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '5000-8000',
      partnerRequirements: '成都或四川人，性格好，喜欢喝茶聊天，最好也喜欢艺术。',
      avatarPhotoId: 'photo_022', profileCompleteness: 90
    },
    {
      id: 'p_023', userId: 'u_023', displayName: '韩春华', gender: 'female', birthDate: '1973-07-22',
      height: 163, weight: 58, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'with_me',
      education: 'bachelor', occupation: '企业中层', incomeRange: '8000-12000',
      province: '湖北省', city: '武汉', district: '江岸区',
      hobbies: ['羽毛球', '读书', '摄影', '旅游'],
      personalityTags: ['独立', '大方', '坚强', '顾家'],
      selfIntro: '在一家国企做行政经理，工作稳定。离婚七年了，女儿跟我，现在读初中。虽然单亲妈妈不容易，但我习惯了，也把生活打理得不错。性格直爽大方，不喜欢拐弯抹角。希望能找到一个能接纳我和女儿的男士，你对我好，我也会加倍对你好。',
      partnerAgeMin: 45, partnerAgeMax: 60, partnerEducation: ['college', 'bachelor', 'master'],
      partnerMaritalStatus: ['divorced', 'widowed', 'single'], partnerIncomeMin: '8000-12000',
      partnerRequirements: '善良正直，能接纳有孩子的女性。武汉本地人，有责任心。',
      avatarPhotoId: 'photo_023', profileCompleteness: 85
    },
    {
      id: 'p_024', userId: 'u_024', displayName: '钱海丽', gender: 'female', birthDate: '1969-06-18',
      height: 160, weight: 56, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'bachelor', occupation: '护士长', incomeRange: '8000-12000',
      province: '重庆市', city: '重庆', district: '江北区',
      hobbies: ['养生保健', '烹饪', '旅游', '广场舞'],
      personalityTags: ['善良', '勤劳', '细心', '随和'],
      selfIntro: '在重庆一家医院做护士长，工作认真负责。离婚后儿子跟了我，现在他在成都上大学了。性格比较顾家，喜欢把家里收拾得干干净净。做菜手艺不错，火锅和家常菜都拿手。想找个性格好的男伴，互相照顾，不要再一个人吃晚饭了。',
      partnerAgeMin: 48, partnerAgeMax: 63, partnerEducation: ['college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '5000-8000',
      partnerRequirements: '重庆或四川人，性格好脾气好，会疼人。不接受异地。',
      avatarPhotoId: 'photo_024', profileCompleteness: 84
    },
    {
      id: 'p_025', userId: 'u_025', displayName: '宋翠萍', gender: 'female', birthDate: '1961-05-30',
      height: 156, weight: 60, maritalStatus: 'widowed', hasChildren: true, childrenLivingWith: 'independent',
      education: 'high_school', occupation: '退休工人', incomeRange: '3000-5000',
      province: '陕西省', city: '西安', district: '碑林区',
      hobbies: ['太极拳', '散步', '养花', '烹饪', '戏曲'],
      personalityTags: ['善良', '勤劳', '乐观'],
      selfIntro: '退休纺织女工，在西安碑林区住了几十年了。老头子走了七八年了，三个孩子都成了家。虽然退休金不多，但生活够用。每天早上打太极拳，晚上在城墙根散步。喜欢听秦腔，也爱摆弄花草。想找个老实本分的老伴，一起买菜做饭，说说话就很好了。',
      partnerAgeMin: 62, partnerAgeMax: 75, partnerEducation: ['high_school'],
      partnerMaritalStatus: ['widowed'], partnerIncomeMin: 'below_3000',
      partnerRequirements: '身体健康，老实本分，西安本地人。最好是退休的有退休金的。',
      avatarPhotoId: 'photo_025', profileCompleteness: 76
    },
    {
      id: 'p_026', userId: 'u_026', displayName: '蒋淑红', gender: 'female', birthDate: '1974-10-05',
      height: 164, weight: 53, maritalStatus: 'single', hasChildren: false, childrenLivingWith: null,
      education: 'master', occupation: '公务员', incomeRange: '8000-12000',
      province: '山东省', city: '青岛', district: '崂山区',
      hobbies: ['游泳', '读书', '旅游', '摄影', '投资理财'],
      personalityTags: ['稳重', '细心', '独立', '真诚'],
      selfIntro: '在青岛市政府工作，科级干部。年轻时读了很多书，对另一半要求比较高，所以一直没有找到合适的。现在年纪大了更懂得珍惜。性格稳重但内心浪漫，喜欢海。平时除了工作就是看书游泳。想找一位有共同语言的男士，哪怕慢慢了解也可以，不急于求成。',
      partnerAgeMin: 42, partnerAgeMax: 58, partnerEducation: ['bachelor', 'master', 'doctor'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '8000-12000',
      partnerRequirements: '有知识有修养，工作稳定，性格温和，最好在青岛或山东地区。',
      avatarPhotoId: 'photo_026', profileCompleteness: 88
    },
    {
      id: 'p_027', userId: 'u_027', displayName: '宋建芬', gender: 'female', birthDate: '1971-01-15',
      height: 161, weight: 57, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'college', occupation: '会计', incomeRange: '5000-8000',
      province: '河南省', city: '郑州', district: '金水区',
      hobbies: ['广场舞', '烹饪', '旅游', '养花'],
      personalityTags: ['开朗', '顾家', '善良', '乐观'],
      selfIntro: '在郑州一家私企做会计，工作不累。离婚多年，女儿在外地读大学。一个人在家总觉得冷清，所以经常去跳广场舞，也认识了不少朋友。性格开朗爱笑，朋友都说我心态年轻。想找一个能一起热闹过日子的男士，一起做饭、跳舞、旅行，让晚年红红火火的。',
      partnerAgeMin: 50, partnerAgeMax: 63, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '3000-5000',
      partnerRequirements: '性格好，爱热闹，河南或周边省份，最好是河南人，吃面食不打架。',
      avatarPhotoId: 'photo_027', profileCompleteness: 80
    },
    {
      id: 'p_028', userId: 'u_028', displayName: '邓香云', gender: 'female', birthDate: '1966-09-03',
      height: 158, weight: 54, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'bachelor', occupation: '医生', incomeRange: '12000-20000',
      province: '湖南省', city: '长沙', district: '芙蓉区',
      hobbies: ['读书', '摄影', '旅游', '乐器', '养生保健'],
      personalityTags: ['温柔', '稳重', '大方', '善良'],
      selfIntro: '长沙某医院的妇产科主任医师，工作兢兢业业三十年。离异后一心扑在工作上，现在快退休了才开始考虑个人问题。性格温柔细腻，喜欢安静。会弹古筝，也喜欢摄影。经济条件不错，有房有车。想找一位有素质的男士，一起品茶听琴，享受余生。',
      partnerAgeMin: 52, partnerAgeMax: 68, partnerEducation: ['college', 'bachelor', 'master', 'doctor'],
      partnerMaritalStatus: ['divorced', 'widowed'], partnerIncomeMin: '8000-12000',
      partnerRequirements: '有素质有涵养，湖南或南方地区，最好也是知识分子。',
      avatarPhotoId: 'photo_028', profileCompleteness: 87
    },
    {
      id: 'p_029', userId: 'u_029', displayName: '潘月梅', gender: 'female', birthDate: '1964-04-28',
      height: 160, weight: 59, maritalStatus: 'widowed', hasChildren: true, childrenLivingWith: 'independent',
      education: 'high_school', occupation: '家庭主妇', incomeRange: 'below_3000',
      province: '河北省', city: '石家庄', district: '桥西区',
      hobbies: ['烹饪', '养花', '散步', '太极拳'],
      personalityTags: ['善良', '勤劳', '顾家', '老实'],
      selfIntro: '这辈子主要是操持家务、带孩子，没怎么上过班。老公十年前走了，三个孩子有两个在石家庄，一个在北京。孩子们都劝我再找一个，说怕我一个人孤单。我做了一辈子饭，厨艺还不错，家里也收拾得干净。想找一个踏实本分的老伴，一起做个伴，互相照应。',
      partnerAgeMin: 58, partnerAgeMax: 72, partnerEducation: ['high_school'],
      partnerMaritalStatus: ['widowed', 'divorced'], partnerIncomeMin: 'below_3000',
      partnerRequirements: '踏实可靠，不嫌弃家庭主妇，石家庄或河北人。',
      avatarPhotoId: 'photo_029', profileCompleteness: 70
    },
    {
      id: 'p_030', userId: 'u_030', displayName: '方丽琴', gender: 'female', birthDate: '1978-02-12',
      height: 166, weight: 50, maritalStatus: 'single', hasChildren: false, childrenLivingWith: null,
      education: 'master', occupation: '律师', incomeRange: 'above_20000',
      province: '福建省', city: '厦门', district: '湖里区',
      hobbies: ['游泳', '旅游', '读书', '摄影', '瑜伽'],
      personalityTags: ['独立', '成熟', '大方', '真诚'],
      selfIntro: '厦门本地人，从事律师行业近二十年，现在是合伙人。一直没有结婚，主要是对感情比较慎重，不想将就。经济独立，生活自律，喜欢运动和旅行。虽然是律师但生活中并不强势，希望能遇到一个让我卸下铠甲、安心依靠的人。',
      partnerAgeMin: 42, partnerAgeMax: 55, partnerEducation: ['bachelor', 'master', 'doctor'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '12000-20000',
      partnerRequirements: '成熟稳重有担当，事业有成，人品好是第一位。最好在福建或珠三角。',
      avatarPhotoId: 'photo_030', profileCompleteness: 89
    },
    {
      id: 'p_031', userId: 'u_031', displayName: '肖红', gender: 'female', birthDate: '1967-06-08',
      height: 159, weight: 55, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'college', occupation: '导游', incomeRange: '5000-8000',
      province: '云南省', city: '昆明', district: '五华区',
      hobbies: ['旅游', '摄影', '唱歌', '烹饪', '广场舞'],
      personalityTags: ['开朗', '热情', '大方', '幽默'],
      selfIntro: '在昆明做了二十多年导游，跑遍了云南的山山水水。性格外向开朗，爱说爱笑。离婚十几年了，女儿跟她爸爸在四川。虽然一个人生活，但从来不觉得孤单，朋友多得很。不过年纪大了，还是想找个踏实的伴。你要是闷，我能让你天天开心！',
      partnerAgeMin: 50, partnerAgeMax: 65, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['divorced', 'widowed', 'single'], partnerIncomeMin: '3000-5000',
      partnerRequirements: '性格开朗能接住我的幽默，喜欢旅行加分。不限地域，能来昆明最好。',
      avatarPhotoId: 'photo_031', profileCompleteness: 83
    },
    {
      id: 'p_032', userId: 'u_032', displayName: '姚素玲', gender: 'female', birthDate: '1962-07-19',
      height: 155, weight: 53, maritalStatus: 'widowed', hasChildren: true, childrenLivingWith: 'independent',
      education: 'college', occupation: '退休会计', incomeRange: '5000-8000',
      province: '江苏省', city: '苏州', district: '姑苏区',
      hobbies: ['书画', '戏曲', '养花', '旅游', '烹饪'],
      personalityTags: ['温和', '善良', '稳重', '细心'],
      selfIntro: '苏州土著，退休前在银行当会计。老伴去世后一个人在姑苏老房子里住。喜欢听评弹，养了很多兰花。虽然退休了但生活很充实，在社区做志愿者。性格温和，待人和气。想找一个有共同爱好的老先生，一起逛园林、听评弹，把苏州的慢生活过好。',
      partnerAgeMin: 60, partnerAgeMax: 75, partnerEducation: ['high_school', 'college', 'bachelor'],
      partnerMaritalStatus: ['widowed', 'divorced'], partnerIncomeMin: '5000-8000',
      partnerRequirements: '苏州人或长三角地区，有文化修养，喜欢江南的生活方式。',
      avatarPhotoId: 'photo_032', profileCompleteness: 88
    },
    {
      id: 'p_033', userId: 'u_033', displayName: '段淑芬', gender: 'female', birthDate: '1976-11-30',
      height: 163, weight: 54, maritalStatus: 'divorced', hasChildren: true, childrenLivingWith: 'independent',
      education: 'bachelor', occupation: '企业经理', incomeRange: '12000-20000',
      province: '辽宁省', city: '沈阳', district: '和平区',
      hobbies: ['瑜伽', '读书', '旅游', '烹饪', '养生保健'],
      personalityTags: ['独立', '成熟', '大方', '温柔'],
      selfIntro: '在沈阳一家国企做人事经理，工作稳定。离婚后女儿在外地上大学，生活自由但也有些孤单。性格外柔内刚，工作上是女强人，回到家也喜欢做饭做甜点。想找一个能欣赏独立女性、又能给我温暖的男士。不需要你多有钱，重要的是懂得珍惜和尊重。',
      partnerAgeMin: 45, partnerAgeMax: 60, partnerEducation: ['bachelor', 'master', 'doctor'],
      partnerMaritalStatus: ['single', 'divorced'], partnerIncomeMin: '8000-12000',
      partnerRequirements: '稳重有责任心，尊重女性，最好是东北人，豪爽大气。',
      avatarPhotoId: 'photo_033', profileCompleteness: 86
    }
  ];

  profileDefs.forEach(function (d) {
    var createdMonth = randInt(4, 5);
    var createdDay = randInt(1, 28);
    PROFILES.push({
      id: d.id,
      userId: d.userId,
      displayName: d.displayName,
      gender: d.gender,
      birthDate: d.birthDate,
      height: d.height,
      weight: d.weight,
      maritalStatus: d.maritalStatus,
      hasChildren: d.hasChildren,
      childrenLivingWith: d.childrenLivingWith,
      education: d.education,
      occupation: d.occupation,
      incomeRange: d.incomeRange,
      province: d.province,
      city: d.city,
      district: d.district,
      hobbies: d.hobbies,
      personalityTags: d.personalityTags,
      selfIntro: d.selfIntro,
      partnerAgeMin: d.partnerAgeMin,
      partnerAgeMax: d.partnerAgeMax,
      partnerEducation: d.partnerEducation,
      partnerMaritalStatus: d.partnerMaritalStatus,
      partnerIncomeMin: d.partnerIncomeMin,
      partnerRequirements: d.partnerRequirements,
      avatarPhotoId: d.avatarPhotoId,
      profileCompleteness: d.profileCompleteness,
      createdAt: iso(createdMonth, createdDay, 10),
      updatedAt: iso(6, randInt(1, 20), 9)
    });
  });

  // ═══════════════════════════════════════════════════════════
  //  3. GROUPS
  // ═══════════════════════════════════════════════════════════
  var GROUPS = [
    {
      id: 'g_001',
      name: '太极拳爱好者',
      category: '运动健身',
      description: '喜欢太极拳的朋友们一起交流拳法心得，组织晨练活动。无论你是新手还是老手，都欢迎加入！我们在全国各地都有线下练习点。',
      memberIds: ['u_001', 'u_003', 'u_008', 'u_011', 'u_025', 'u_022', 'u_029'],
      createdBy: 'u_admin',
      createdAt: iso(5, 1, 9),
      updatedAt: iso(6, 15, 10)
    },
    {
      id: 'g_002',
      name: '单身旅游团',
      category: '生活休闲',
      description: '一个人旅游不如一群人旅游！定期组织周边游、国内游活动，在旅途中遇见有趣的人和可能的缘分。欢迎爱好旅游的朋友加入。',
      memberIds: ['u_002', 'u_005', 'u_009', 'u_013', 'u_017', 'u_020', 'u_026', 'u_030', 'u_031', 'u_033'],
      createdBy: 'u_009',
      createdAt: iso(5, 5, 14),
      updatedAt: iso(6, 18, 16)
    },
    {
      id: 'g_003',
      name: '书画雅集',
      category: '文化艺术',
      description: '以书会友，以画传情。这里是书画爱好者的天地，分享作品、交流技法、组织展览。让传统文化成为我们相识的桥梁。',
      memberIds: ['u_001', 'u_006', 'u_010', 'u_011', 'u_019', 'u_022', 'u_032'],
      createdBy: 'u_011',
      createdAt: iso(5, 8, 10),
      updatedAt: iso(6, 12, 14)
    },
    {
      id: 'g_004',
      name: '美食烹饪社',
      category: '生活休闲',
      description: '爱做饭的人运气不会太差！分享拿手菜、交换食谱、组织美食品鉴活动。用一顿好饭，温暖彼此的胃和心。',
      memberIds: ['u_005', 'u_007', 'u_009', 'u_013', 'u_016', 'u_018', 'u_022', 'u_024', 'u_025', 'u_027', 'u_029', 'u_031'],
      createdBy: 'u_005',
      createdAt: iso(5, 10, 11),
      updatedAt: iso(6, 17, 15)
    },
    {
      id: 'g_005',
      name: '书香读书会',
      category: '学习成长',
      description: '一本好书，一杯清茶，一段人生感悟。每月共读一本好书，线下分享交流会。在书香中遇见有趣的灵魂。',
      memberIds: ['u_001', 'u_004', 'u_006', 'u_010', 'u_012', 'u_017', 'u_019', 'u_020', 'u_026', 'u_028', 'u_030', 'u_033'],
      createdBy: 'u_012',
      createdAt: iso(5, 3, 15),
      updatedAt: iso(6, 14, 11)
    },
    {
      id: 'g_006',
      name: '乒乓球俱乐部',
      category: '运动健身',
      description: '国球乒乓，老少皆宜！每周固定球友交流赛，不定期组织友谊赛。水平不限，重在参与和交友。',
      memberIds: ['u_002', 'u_005', 'u_009', 'u_014', 'u_018', 'u_023', 'u_027'],
      createdBy: 'u_005',
      createdAt: iso(5, 7, 16),
      updatedAt: iso(6, 16, 9)
    },
    {
      id: 'g_007',
      name: '退休生活圈',
      category: '生活休闲',
      description: '退休不是终点，而是新生活的起点！本群面向已退休或即将退休的朋友，分享退休生活经验，组织各种兴趣活动，让退休生活丰富多彩。',
      memberIds: ['u_001', 'u_003', 'u_008', 'u_011', 'u_016', 'u_022', 'u_025', 'u_029', 'u_032'],
      createdBy: 'u_001',
      createdAt: iso(5, 2, 8),
      updatedAt: iso(6, 19, 7)
    },
    {
      id: 'g_008',
      name: '音乐票友会',
      category: '文化艺术',
      description: '爱唱歌、爱听戏、爱乐器的朋友看过来！定期组织K歌活动、戏曲欣赏、小型音乐会。用音乐连接你我。',
      memberIds: ['u_006', 'u_008', 'u_013', 'u_018', 'u_021', 'u_025', 'u_028', 'u_031'],
      createdBy: 'u_006',
      createdAt: iso(5, 12, 18),
      updatedAt: iso(6, 13, 20)
    }
  ];

  // ═══════════════════════════════════════════════════════════
  //  4. EVENTS
  // ═══════════════════════════════════════════════════════════
  var EVENTS = [
    {
      id: 'e_001',
      name: '周末公园相亲角活动',
      type: 'offline',
      description: '在北京朝阳公园举办相亲角活动，为中年单身朋友提供面对面交流的机会。现场设有自我介绍环节、自由交流区、兴趣小组讨论等。请您带上真诚，我们提供平台。',
      location: '北京朝阳公园南门广场',
      province: '北京市',
      city: '北京',
      startTime: '2026-07-05T09:00:00.000Z',
      endTime: '2026-07-05T12:00:00.000Z',
      maxAttendees: 50,
      attendeeIds: ['u_001', 'u_016', 'u_002', 'u_017', 'u_025'],
      organizedBy: 'u_admin',
      status: 'upcoming',
      createdAt: iso(6, 1, 10)
    },
    {
      id: 'e_002',
      name: '杭州西湖徒步交友',
      type: 'offline',
      description: '沿西湖徒步赏景，在美丽的自然风光中轻松交友。全程约8公里，途经断桥、苏堤、雷峰塔。中午在龙井村品尝地道杭帮菜。适合喜欢运动和户外活动的朋友。',
      location: '杭州西湖苏堤入口',
      province: '浙江省',
      city: '杭州',
      startTime: '2026-07-12T08:30:00.000Z',
      endTime: '2026-07-12T15:00:00.000Z',
      maxAttendees: 40,
      attendeeIds: ['u_006', 'u_020', 'u_015', 'u_019'],
      organizedBy: 'u_006',
      status: 'upcoming',
      createdAt: iso(6, 3, 9)
    },
    {
      id: 'e_003',
      name: '线上视频交友会 — "聊聊我们的故事"',
      type: 'online',
      description: '通过腾讯会议举办的线上交友活动。每位参与者有5分钟的时间分享自己的人生故事或兴趣爱好，然后进入自由交流分组讨论。足不出户也能认识新朋友！',
      location: '腾讯会议（会议号活动前一天发送）',
      province: '',
      city: '',
      startTime: '2026-07-20T19:30:00.000Z',
      endTime: '2026-07-20T21:30:00.000Z',
      maxAttendees: 30,
      attendeeIds: ['u_004', 'u_009', 'u_013', 'u_017', 'u_020', 'u_026', 'u_030', 'u_033'],
      organizedBy: 'u_admin',
      status: 'upcoming',
      createdAt: iso(6, 5, 14)
    },
    {
      id: 'e_004',
      name: '成都人民公园品茶相亲',
      type: 'offline',
      description: '在成都人民公园百年鹤鸣茶社品茶聊天。正宗的盖碗茶、地道的成都慢生活。安排有破冰游戏和一对一聊天轮换。天气好的话还可以一起去逛宽窄巷子。',
      location: '成都人民公园鹤鸣茶社',
      province: '四川省',
      city: '成都',
      startTime: '2026-08-02T14:00:00.000Z',
      endTime: '2026-08-02T17:00:00.000Z',
      maxAttendees: 35,
      attendeeIds: ['u_005', 'u_022', 'u_024', 'u_009', 'u_027'],
      organizedBy: 'u_005',
      status: 'upcoming',
      createdAt: iso(6, 7, 11)
    },
    {
      id: 'e_005',
      name: '周末登山健康行',
      type: 'offline',
      description: '深圳梧桐山登山活动，难度中等，适合有一定运动基础的朋友。在山顶俯瞰深圳全景。下山后安排农家乐聚餐。运动+美食，健康交友两不误。',
      location: '深圳梧桐山北门',
      province: '广东省',
      city: '深圳',
      startTime: '2026-08-15T07:00:00.000Z',
      endTime: '2026-08-15T14:00:00.000Z',
      maxAttendees: 30,
      attendeeIds: ['u_004', 'u_019', 'u_030', 'u_010'],
      organizedBy: 'u_004',
      status: 'upcoming',
      createdAt: iso(6, 10, 8)
    },
    {
      id: 'e_006',
      name: '上海美食探店单身派对',
      type: 'offline',
      description: '相约上海城隍庙，一起品尝地道的上海小吃和本帮菜。边吃边聊，美食是最好的话题引子。餐后逛豫园，在江南园林中漫步交流。',
      location: '上海城隍庙美食广场',
      province: '上海市',
      city: '上海',
      startTime: '2026-08-22T11:00:00.000Z',
      endTime: '2026-08-22T16:00:00.000Z',
      maxAttendees: 40,
      attendeeIds: ['u_002', 'u_017', 'u_032', 'u_024'],
      organizedBy: 'u_002',
      status: 'upcoming',
      createdAt: iso(6, 12, 13)
    }
  ];

  // ═══════════════════════════════════════════════════════════
  //  5. STORIES (success stories)
  // ═══════════════════════════════════════════════════════════
  var STORIES = [
    {
      id: 's_001',
      name: '张大爷和李阿姨的幸福晚年',
      summary: '通过平台组织的太极拳活动相识，交往半年后领证结婚，如今一起在成都安享晚年。',
      content: '六十岁的张大爷和三年前失去了老伴，孩子们都在外地工作，一个人住在成都。通过平台加入了太极拳爱好者群，在一次线下活动中认识了五十八岁的李阿姨。两人都是太极拳爱好者，从一起晨练开始，慢慢熟悉起来。张大爷说："她打拳的时候特别专注，那种安静典雅的气质打动了我。"李阿姨则说："他很细心，每次晨练都会给我带一杯温水，这些小细节让我觉得他是个可以依靠的人。"交往半年后，两人在孩子们的祝福下领了结婚证。如今每天早上一起去公园打太极，下午在家一个写字一个画画，日子过得平静而幸福。张大爷常说："晚年遇到她，是我的福气。"',
      isPublished: true,
      createdAt: iso(4, 15, 10)
    },
    {
      id: 's_002',
      name: '跨越千里的爱情 — 北京大叔与广州阿姨',
      summary: '线上相识，视频聊了三个月后线下见面，大叔为爱迁居广州。',
      content: '六十三岁的王老师是北京的一名退休中学教师，五十五岁的蔡姐是广州的一个服装店老板。两人在平台的线上交友会上认识。起初只是觉得聊得来，后来每天都要视频通话，一聊就是一两个小时。王老师喜欢蔡姐的热情开朗，蔡姐欣赏王老师的温文尔雅。三个月后，王老师飞到广州见面，两人在广州塔下的珠江边散步，觉得这就是对的人。做了一个艰难的决定——王老师搬到广州生活。虽然离开了生活大半辈子的北京，但王老师觉得值得："和她在一起，哪里都是家。"如今两人一起经营着小店，日子过得红红火火。',
      isPublished: true,
      createdAt: iso(4, 20, 14)
    },
    {
      id: 's_003',
      name: '同桌的你（中年版）',
      summary: '两人在读书会上相识，发现住同一个小区，从书友变成伴侣。',
      content: '四十八岁的刘女士和五十二岁的周先生都是上海人，住在同一个小区却互不相识，直到在平台的读书会上相遇。两人都被分配到同一个讨论小组，聊《平凡的世界》时发现三观特别契合。会后一交流，竟然住在隔壁楼！缘分就是这么奇妙。从那以后，两人经常约在小区花园散步，周末一起去图书馆。交往一年后决定在一起，没有大办婚礼，只是请了几个亲近的朋友吃了顿饭。刘女士说："中年再婚不需要轰轰烈烈，平淡的陪伴就是最好的爱情。"',
      isPublished: true,
      createdAt: iso(5, 5, 9)
    },
    {
      id: 's_004',
      name: '退休后的人生第二春',
      summary: '两人都是退休老师，通过平台相识后一起报名老年大学，活到老学到老。',
      content: '六十五岁的胡老师和六十二岁的唐阿姨，退休前都是老师，一个教美术一个教语文。通过平台相识后，两人发现有很多共同话题。胡老师说："我们这一代人，经历了太多，到老了反而更懂得珍惜。"两人一起报名了老年大学的摄影班和英语班，每个周末都带着相机走街串巷拍照片。胡老师还给唐阿姨画像，唐阿姨则给胡老师的画配诗。他们的故事在老年大学传为佳话。唐阿姨说："年轻时候谈对象看条件，现在看的是人品和相处舒服不舒服。跟他在一起，我觉得自己年轻了十岁。"',
      isPublished: true,
      createdAt: iso(5, 12, 11)
    },
    {
      id: 's_005',
      name: '单亲爸妈的温暖重逢',
      summary: '离异单亲爸妈通过平台相识，两个家庭融合成了一家人。',
      content: '四十六岁的陈姐是武汉的一名护士长，带着上初中的女儿。五十岁的朱教授是大学老师，带着上高中的儿子。两人在平台的一次线下徒步活动中认识。陈姐说："刚开始其实没抱太大希望，毕竟都带着孩子，不好找。"但朱教授的真诚和责任感打动了她。两人交往后，发现两个孩子也意外地合得来，朱教授的儿子会辅导陈姐女儿功课，陈姐女儿则教朱教授儿子弹钢琴。去年春节，两家人一起包饺子过年，陈姐的女儿突然说："妈妈，我们四个人在一起，就像一个完整的家。"这句话让两个大人都红了眼眶。如今他们已经组建了新的家庭，一家人其乐融融。',
      isPublished: true,
      createdAt: iso(5, 18, 16)
    },
    {
      id: 's_006',
      name: '深圳 IT 男的春天来了',
      summary: '大龄未婚程序员通过平台找到了真爱，两人从朋友做起，发展成恋人。',
      content: '四十八岁的刘先生是深圳的一名资深工程师，年收入不错但一直未婚。用他自己的话说："年轻时候太拼了，觉得谈恋爱好浪费时间，结果一抬头发现自己快五十了。"通过平台认识了四十二岁的方律师，两人第一次见面约在了深圳湾公园。刘先生其实很紧张，聊的都是技术话题，但方律师觉得他很可爱。方律师说："他虽然不太会表达，但人很真诚，这是装不出来的。"两人从朋友做起，慢慢发展成了恋人。刘先生学会了浪漫，会在方律师加班时送去亲手做的便当。方律师则教刘先生如何更好地与人沟通。交往一年后，两人正在计划领证。刘先生说："写代码写了二十年，终于找到了生命中最重要的那个人。"',
      isPublished: true,
      createdAt: iso(6, 2, 8)
    }
  ];

  // ═══════════════════════════════════════════════════════════
  //  6. SAFETY TIPS
  // ═══════════════════════════════════════════════════════════
  var SAFETY_TIPS = [
    {
      id: 'tip_001',
      title: '初次见面安全须知',
      content: '第一次见面请选择人多的公共场所，如咖啡厅、公园、商场等。不要邀请对方去自己或对方的家中。告诉家人或朋友你的约会地点和时间，保持手机畅通。如果感觉不适或对方行为可疑，请立即离开并联系平台客服。您的安全永远是第一位的。',
      category: 'meeting',
      order: 1,
      createdAt: iso(5, 1, 8)
    },
    {
      id: 'tip_002',
      title: '警惕金钱诈骗',
      content: '任何以"投资""借钱""家人生病""急需周转"等为由向您索要钱财的行为都可能是诈骗。真正的交友对象不会在未深入了解的情况下向您借钱。如果对方频繁提及投资理财、虚拟货币、网络博彩等话题，请高度警惕。一旦涉及金钱往来，请务必三思而后行。',
      category: 'scam',
      order: 2,
      createdAt: iso(5, 1, 8)
    },
    {
      id: 'tip_003',
      title: '保护个人隐私信息',
      content: '在建立充分信任之前，不要轻易透露您的身份证号码、家庭住址、银行卡号、支付宝/微信支付密码等敏感信息。建议使用平台内的聊天功能进行沟通，不要急于添加对方的私人微信或 QQ。如果对方频繁索要您的私人信息，请保持警惕。',
      category: 'chat',
      order: 3,
      createdAt: iso(5, 1, 8)
    },
    {
      id: 'tip_004',
      title: '识别虚假身份和照片',
      content: '如果对方的照片看起来过于完美（像明星或模特），可能是盗用他人照片。可以要求对方进行视频通话确认身份。注意对方个人信息中的矛盾之处，如年龄与工作经历不符、说话前后不一致等。平台支持举报虚假信息，欢迎您帮助我们维护平台诚信。',
      category: 'profile',
      order: 4,
      createdAt: iso(5, 1, 8)
    },
    {
      id: 'tip_005',
      title: '线上聊天注意事项',
      content: '线上交流时保持礼貌和尊重，不要发送不当言语或图片。如果对方在聊天中让您感到不适，您可以随时拉黑或举报。不要轻信对方的一面之词，特别是涉及婚姻状况、经济条件等方面。建议多交流几次，深入了解后再决定是否见面。',
      category: 'chat',
      order: 5,
      createdAt: iso(5, 1, 8)
    },
    {
      id: 'tip_006',
      title: '婚托和酒托防范指南',
      content: '如果对方第一次见面就约在特定的餐厅、酒吧或茶室，且消费明显偏高，请提高警惕，这可能是酒托或婚托的套路。建议您主动提议见面地点，选择自己熟悉的公共场所。如果被带到不熟悉的高消费场所，您可以拒绝消费并离开。保留消费凭证，及时向平台投诉。',
      category: 'scam',
      order: 6,
      createdAt: iso(5, 1, 8)
    },
    {
      id: 'tip_007',
      title: '完整个人资料的重要性',
      content: '建议您尽量完善个人资料，上传真实照片和完善身份信息。完整的资料不仅能让更多人了解您，提高匹配成功率，也是对其他用户的尊重。平台会对资料的真实性进行审核。同时，建议您优先选择资料完整且经过实名认证的用户进行交流。',
      category: 'profile',
      order: 7,
      createdAt: iso(5, 1, 8)
    },
    {
      id: 'tip_008',
      title: '异地见面安全指南',
      content: '如果双方居住在不同城市，建议第一次见面选择折中的城市或大型公共场合。提前预订正规酒店，不要入住对方安排的住所。告知家人或朋友您的行程安排、住宿地点和对方的联系方式。保持每日与家人报平安的习惯，如遇紧急情况请立即拨打110。',
      category: 'meeting',
      order: 8,
      createdAt: iso(5, 1, 8)
    },
    {
      id: 'tip_009',
      title: '子女意见的沟通建议',
      content: '对于有子女的中年单身人士，建议在关系发展到一定阶段后，适时与子女沟通，听取他们的意见。子女的支持对未来的家庭和谐非常重要。同时也要注意，不要让子女过度干涉您的感情生活。找到一个平衡点，既尊重子女也尊重自己的选择。',
      category: 'meeting',
      order: 9,
      createdAt: iso(5, 1, 8)
    },
    {
      id: 'tip_010',
      title: '财产安全的保护建议',
      content: '中年再婚涉及到双方的财产问题，建议在感情稳定后，坦诚地沟通财产状况。可以考虑在正式结婚前进行婚前财产公证，这不是不信任，而是对双方的保护。同时警惕以"共同投资""合作项目"为由诱导您出资的行为。保护好自己的养老钱和房产。',
      category: 'scam',
      order: 10,
      createdAt: iso(5, 1, 8)
    }
  ];

  // ═══════════════════════════════════════════════════════════
  //  7. MATCHES (pre-existing matches between compatible users)
  // ═══════════════════════════════════════════════════════════
  var MATCHES = [
    {
      id: 'm_001',
      userId1: 'u_001', userId2: 'u_016',
      status: 'matched', matchedAt: iso(6, 5, 14),
      initiatedBy: 'u_001'
    },
    {
      id: 'm_002',
      userId1: 'u_003', userId2: 'u_022',
      status: 'matched', matchedAt: iso(6, 8, 11),
      initiatedBy: 'u_003'
    },
    {
      id: 'm_003',
      userId1: 'u_005', userId2: 'u_024',
      status: 'matched', matchedAt: iso(6, 10, 15),
      initiatedBy: 'u_024'
    },
    {
      id: 'm_004',
      userId1: 'u_006', userId2: 'u_020',
      status: 'matched', matchedAt: iso(6, 12, 9),
      initiatedBy: 'u_006'
    },
    {
      id: 'm_005',
      userId1: 'u_009', userId2: 'u_026',
      status: 'matched', matchedAt: iso(6, 14, 10),
      initiatedBy: 'u_009'
    },
    {
      id: 'm_006',
      userId1: 'u_012', userId2: 'u_023',
      status: 'matched', matchedAt: iso(6, 15, 16),
      initiatedBy: 'u_012'
    },
    {
      id: 'm_007',
      userId1: 'u_015', userId2: 'u_030',
      status: 'liked_by_user1', matchedAt: null,
      initiatedBy: 'u_015'
    },
    {
      id: 'm_008',
      userId1: 'u_004', userId2: 'u_017',
      status: 'liked_by_user2', matchedAt: null,
      initiatedBy: 'u_017'
    },
    {
      id: 'm_009',
      userId1: 'u_011', userId2: 'u_032',
      status: 'matched', matchedAt: iso(6, 16, 8),
      initiatedBy: 'u_032'
    },
    {
      id: 'm_010',
      userId1: 'u_007', userId2: 'u_021',
      status: 'matched', matchedAt: iso(6, 18, 13),
      initiatedBy: 'u_007'
    }
  ];

  // ═══════════════════════════════════════════════════════════
  //  8. MESSAGES (sample conversations between matched users)
  // ═══════════════════════════════════════════════════════════
  var MESSAGES = [
    // 王建国 & 严丽华
    {
      id: 'msg_001', matchId: 'm_001', fromUserId: 'u_001', toUserId: 'u_016',
      content: '严女士您好，看到您是退休护士，我也是退休的，以前是中学老师。都在北京，挺有缘的。',
      createdAt: iso(6, 5, 14), isRead: true
    },
    {
      id: 'msg_002', matchId: 'm_001', fromUserId: 'u_016', toUserId: 'u_001',
      content: '王老师您好！是啊，都在北京确实方便。您平时都喜欢做些什么呢？',
      createdAt: iso(6, 5, 15), isRead: true
    },
    {
      id: 'msg_003', matchId: 'm_001', fromUserId: 'u_001', toUserId: 'u_016',
      content: '我每天早上打太极拳，下午练字看书。退休了就想把生活过得充实一点。听说您也在学烹饪？',
      createdAt: iso(6, 5, 16), isRead: true
    },
    {
      id: 'msg_004', matchId: 'm_001', fromUserId: 'u_016', toUserId: 'u_001',
      content: '是的，在老年大学报了烹饪班。王老师要是不嫌弃，有空可以一起喝杯茶，聊聊天。',
      createdAt: iso(6, 6, 10), isRead: true
    },
    {
      id: 'msg_005', matchId: 'm_001', fromUserId: 'u_001', toUserId: 'u_016',
      content: '好啊！我知道朝阳公园附近有个不错的茶馆，下周末您有空吗？',
      createdAt: iso(6, 6, 11), isRead: true
    },
    {
      id: 'msg_006', matchId: 'm_001', fromUserId: 'u_016', toUserId: 'u_001',
      content: '好啊，周六下午怎么样？我很期待见到您！',
      createdAt: iso(6, 6, 12), isRead: false
    },
    // 陈国强 & 钱海丽
    {
      id: 'msg_007', matchId: 'm_003', fromUserId: 'u_024', toUserId: 'u_005',
      content: '陈大哥好！看到您会做川菜，我正好是重庆人，在重庆做护士长。缘分啊！',
      createdAt: iso(6, 10, 16), isRead: true
    },
    {
      id: 'msg_008', matchId: 'm_003', fromUserId: 'u_005', toUserId: 'u_024',
      content: '哈哈，川渝一家亲嘛！我的拿手菜是回锅肉和水煮鱼，有机会请你尝尝。你平时工作辛苦吗？',
      createdAt: iso(6, 10, 17), isRead: true
    },
    {
      id: 'msg_009', matchId: 'm_003', fromUserId: 'u_024', toUserId: 'u_005',
      content: '还好，做了这么多年习惯了。陈大哥在成都哪个区呀？我经常去成都出差的。',
      createdAt: iso(6, 11, 9), isRead: true
    },
    {
      id: 'msg_010', matchId: 'm_003', fromUserId: 'u_005', toUserId: 'u_024',
      content: '在武侯区，离锦里很近。下次你来成都出差，我请你吃火锅，保证比重庆的差不到哪去！',
      createdAt: iso(6, 11, 10), isRead: true
    },
    // 赵永刚 & 何芳 (both doctors in Hangzhou)
    {
      id: 'msg_011', matchId: 'm_004', fromUserId: 'u_006', toUserId: 'u_020',
      content: '何医生您好，看到您也是医生，在儿科。我是内科的。同行之间应该有不少共同话题。',
      createdAt: iso(6, 12, 10), isRead: true
    },
    {
      id: 'msg_012', matchId: 'm_004', fromUserId: 'u_020', toUserId: 'u_006',
      content: '赵医生您好！是啊，医生找医生可能更能理解彼此的工作节奏。您平时值班多吗？',
      createdAt: iso(6, 12, 11), isRead: true
    },
    {
      id: 'msg_013', matchId: 'm_004', fromUserId: 'u_006', toUserId: 'u_020',
      content: '现在好多了，年轻医生顶在前面，我们主要是指导和疑难会诊。不过有时候半夜有急诊还是得去。',
      createdAt: iso(6, 12, 14), isRead: true
    },
    {
      id: 'msg_014', matchId: 'm_004', fromUserId: 'u_020', toUserId: 'u_006',
      content: '我也是，儿科最近流感多，挺忙的。赵医生除了书法还喜欢什么呀？我看到您的资料里写的。',
      createdAt: iso(6, 13, 9), isRead: false
    },
    // 吴云龙 & 蒋淑红
    {
      id: 'msg_015', matchId: 'm_005', fromUserId: 'u_009', toUserId: 'u_026',
      content: '蒋女士在青岛？我前年去青岛旅游过，特别喜欢那个城市，尤其是崂山。',
      createdAt: iso(6, 14, 11), isRead: true
    },
    {
      id: 'msg_016', matchId: 'm_005', fromUserId: 'u_026', toUserId: 'u_009',
      content: '是啊，吴先生。青岛是个好地方，尤其是夏天。您是重庆人？我还没去过重庆，听说火锅特别好吃。',
      createdAt: iso(6, 14, 12), isRead: true
    },
    {
      id: 'msg_017', matchId: 'm_005', fromUserId: 'u_009', toUserId: 'u_026',
      content: '欢迎来重庆！我给您当导游，保证吃好玩好。我经常出差，下次去青岛一定约你喝咖啡。',
      createdAt: iso(6, 15, 10), isRead: false
    },
    // 朱明远 & 韩春华 (both in Wuhan)
    {
      id: 'msg_018', matchId: 'm_006', fromUserId: 'u_012', toUserId: 'u_023',
      content: '韩女士您好，看到您也在武汉。我在洪山区大学城这边。您女儿多大了？',
      createdAt: iso(6, 15, 17), isRead: true
    },
    {
      id: 'msg_019', matchId: 'm_006', fromUserId: 'u_023', toUserId: 'u_012',
      content: '朱教授您好！我女儿今年初三了，学习挺紧张的。您儿子高中了吧？',
      createdAt: iso(6, 15, 18), isRead: true
    },
    {
      id: 'msg_020', matchId: 'm_006', fromUserId: 'u_012', toUserId: 'u_023',
      content: '是的，读高二了。两个孩子差不多大，也许能玩到一起去。改天周末一起带孩子出来吃个饭？',
      createdAt: iso(6, 16, 10), isRead: false
    },
    // 胡长青 & 姚素玲 (both retired, art lovers)
    {
      id: 'msg_021', matchId: 'm_009', fromUserId: 'u_032', toUserId: 'u_011',
      content: '胡老师您好！看到您会国画，我在苏州也喜欢书画和评弹。您画的什么题材多呀？',
      createdAt: iso(6, 16, 9), isRead: true
    },
    {
      id: 'msg_022', matchId: 'm_009', fromUserId: 'u_011', toUserId: 'u_032',
      content: '姚女士好！我主要画山水和花鸟，青岛的海景也画了不少。苏州是文化名城，我一直想去看看园林。',
      createdAt: iso(6, 16, 10), isRead: true
    },
    {
      id: 'msg_023', matchId: 'm_009', fromUserId: 'u_032', toUserId: 'u_011',
      content: '那太好了！您来苏州我给您做导游，拙政园、留园都值得好好逛。我们可以一起写生。',
      createdAt: iso(6, 17, 8), isRead: false
    },
    // 孙文斌 & 沈秋月 (both in Nanjing)
    {
      id: 'msg_024', matchId: 'm_010', fromUserId: 'u_007', toUserId: 'u_021',
      content: '沈女士好！看到您在秦淮区，我在鼓楼。我在南京开了个小超市，一个人忙前忙后的。',
      createdAt: iso(6, 18, 14), isRead: true
    },
    {
      id: 'msg_025', matchId: 'm_010', fromUserId: 'u_021', toUserId: 'u_007',
      content: '孙大哥好！我在超市做收银员，咱们还是半个同行呢。您平时喜欢钓鱼呀？',
      createdAt: iso(6, 18, 15), isRead: true
    },
    {
      id: 'msg_026', matchId: 'm_010', fromUserId: 'u_007', toUserId: 'u_021',
      content: '哈哈真是巧了！是啊周末喜欢去江边钓鱼。你要是也喜欢，下次带你去，我选个好位置。',
      createdAt: iso(6, 19, 9), isRead: false
    }
  ];

  // ═══════════════════════════════════════════════════════════
  //  9. PRIVACY SETTINGS (one per user — all public initially)
  // ═══════════════════════════════════════════════════════════
  var PRIVACY_SETTINGS = [];
  var allUserIds = USERS.map(function (u) { return u.id; });
  allUserIds.forEach(function (uid) {
    PRIVACY_SETTINGS.push({
      id: 'privacy_' + uid,
      userId: uid,
      showProfile: true,
      showPhone: true,
      showEmail: false,
      showBirthDate: true,
      showIncome: false,
      showToSearch: true,
      allowMessagesFromAll: true,
      createdAt: iso(5, 1, 8),
      updatedAt: iso(5, 1, 8)
    });
  });

  // ═══════════════════════════════════════════════════════════
  //  API — SeedData.load()
  // ═══════════════════════════════════════════════════════════
  function load() {
    if (localStorage.getItem('dating_app_users')) {
      console.log('[SeedData] 数据已存在，跳过初始化。');
      return;
    }

    console.log('[SeedData] 正在初始化种子数据...');

    localStorage.setItem('dating_app_users', JSON.stringify(USERS));
    localStorage.setItem('dating_app_profiles', JSON.stringify(PROFILES));
    localStorage.setItem('dating_app_messages', JSON.stringify(MESSAGES));
    localStorage.setItem('dating_app_matches', JSON.stringify(MATCHES));
    localStorage.setItem('dating_app_groups', JSON.stringify(GROUPS));
    localStorage.setItem('dating_app_events', JSON.stringify(EVENTS));
    localStorage.setItem('dating_app_stories', JSON.stringify(STORIES));
    localStorage.setItem('dating_app_safetyTips', JSON.stringify(SAFETY_TIPS));
    localStorage.setItem('dating_app_privacySettings', JSON.stringify(PRIVACY_SETTINGS));

    console.log('[SeedData] 种子数据初始化完成！');
    console.log('  - 用户: ' + USERS.length + ' 个');
    console.log('  - 档案: ' + PROFILES.length + ' 个');
    console.log('  - 群组: ' + GROUPS.length + ' 个');
    console.log('  - 活动: ' + EVENTS.length + ' 个');
    console.log('  - 成功故事: ' + STORIES.length + ' 个');
    console.log('  - 安全提示: ' + SAFETY_TIPS.length + ' 条');
    console.log('  - 匹配记录: ' + MATCHES.length + ' 条');
    console.log('  - 消息记录: ' + MESSAGES.length + ' 条');
    console.log('  - 隐私设置: ' + PRIVACY_SETTINGS.length + ' 条');
  }

  // 暴露 SeedData 到全局
  window.SeedData = { load: load };

  // 返回整个数据对象供调试
  return {
    USERS: USERS,
    PROFILES: PROFILES,
    GROUPS: GROUPS,
    EVENTS: EVENTS,
    STORIES: STORIES,
    SAFETY_TIPS: SAFETY_TIPS,
    MATCHES: MATCHES,
    MESSAGES: MESSAGES,
    PRIVACY_SETTINGS: PRIVACY_SETTINGS,
    load: load
  };
})();
