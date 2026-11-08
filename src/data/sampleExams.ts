import { Exam } from '../types/quiz';

export const SAMPLE_EXAMS: Exam[] = [
  {
    id: 'exam-tin-hoc-01',
    title: 'Kiến Thức Tin Học & Nền Tảng Web HTML',
    subject: 'Tin học & Công nghệ',
    grade: 'Lớp 10 - 12 / Phổ thông',
    description: 'Kiểm tra kiến thức cốt lõi về ngôn ngữ đánh dấu siêu văn bản HTML, cấu trúc trang web, mạng máy tính và an toàn thông tin.',
    durationMinutes: 15,
    createdAt: '2026-03-01',
    questions: [
      {
        id: 'th-1',
        question: 'HTML là từ viết tắt của cụm từ tiếng Anh nào sau đây?',
        options: [
          'Hyperlinks and Text Markup Language',
          'Hyper Text Markup Language',
          'Home Tool Markup Language',
          'High Technical Modern Language'
        ],
        correctAnswer: 1,
        explanation: 'HTML là viết tắt của "Hyper Text Markup Language" (Ngôn ngữ đánh dấu siêu văn bản), được dùng để cấu trúc nội dung trên World Wide Web.',
        difficulty: 'Dễ'
      },
      {
        id: 'th-2',
        question: 'Thẻ HTML nào sau đây được sử dụng để tạo tiêu đề có kích thước lớn nhất và quan trọng nhất trong trang?',
        options: [
          '<h6>',
          '<heading>',
          '<h1>',
          '<head>'
        ],
        correctAnswer: 2,
        explanation: 'Thẻ <h1> biểu thị tiêu đề cấp cao nhất (heading 1). HTML hỗ trợ từ <h1> đến <h6> với kích thước và độ ưu tiên giảm dần.',
        difficulty: 'Dễ'
      },
      {
        id: 'th-3',
        question: 'Để chèn một hình ảnh vào trang web HTML, thẻ nào sau đây là chính xác?',
        options: [
          '<image src="anh.jpg" alt="ảnh">',
          '<img src="anh.jpg" alt="ảnh" />',
          '<pic href="anh.jpg">',
          '<src img="anh.jpg">'
        ],
        correctAnswer: 1,
        explanation: 'Thẻ <img> là thẻ tự đóng dùng thuộc tính src để chỉ định đường dẫn hình ảnh và thuộc tính alt để mô tả văn bản thay thế.',
        difficulty: 'Dễ'
      },
      {
        id: 'th-4',
        question: 'Để một bài thi trắc nghiệm HTML hoạt động hoàn toàn offline không cần internet, dữ liệu trả lời của học sinh nên được lưu trữ ở đâu trên trình duyệt?',
        options: [
          'Trên Cloud Server của nhà trường',
          'Trong cơ sở dữ liệu MySQL từ xa',
          'Trong localStorage hoặc sessionStorage của trình duyệt',
          'Gửi qua email thông qua giao thức SMTP'
        ],
        correctAnswer: 2,
        explanation: 'localStorage của trình duyệt (Web Storage API) cho phép lưu trữ dữ liệu dạng khóa-giá trị ngay trên thiết bị người dùng mà không cần kết nối mạng internet.',
        difficulty: 'Trung bình'
      },
      {
        id: 'th-5',
        question: 'Thuộc tính "type" nào của thẻ <input> phù hợp nhất để cho phép người dùng chỉ chọn DUY NHẤT một đáp án trong danh sách 4 lựa chọn A, B, C, D?',
        options: [
          'type="checkbox"',
          'type="radio"',
          'type="button"',
          'type="select"'
        ],
        correctAnswer: 1,
        explanation: 'Thẻ <input type="radio" name="cau1"> với các ô có cùng thuộc tính name tạo thành nhóm chọn một duy nhất (mutual exclusion). Thẻ checkbox cho phép chọn nhiều.',
        difficulty: 'Dễ'
      },
      {
        id: 'th-6',
        question: 'Giao thức nào sau đây truyền tải dữ liệu web có mã hóa bảo mật SSL/TLS?',
        options: [
          'HTTP',
          'FTP',
          'HTTPS',
          'SMTP'
        ],
        correctAnswer: 2,
        explanation: 'HTTPS (Hypertext Transfer Protocol Secure) là phiên bản bảo mật của HTTP, sử dụng chứng chỉ SSL/TLS để mã hóa đường truyền dữ liệu giữa client và server.',
        difficulty: 'Trung bình'
      },
      {
        id: 'th-7',
        question: 'Trong JavaScript chạy trên trang web, hàm nào sau đây được sử dụng phổ biến nhất để chuyển đổi một chuỗi văn bản JSON thành một đối tượng JavaScript?',
        options: [
          'JSON.stringify()',
          'JSON.parse()',
          'JSON.toObject()',
          'JSON.convert()'
        ],
        correctAnswer: 1,
        explanation: 'JSON.parse() giải mã chuỗi văn bản JSON thành đối tượng JS, còn JSON.stringify() biến đối tượng JS thành chuỗi JSON.',
        difficulty: 'Trung bình'
      },
      {
        id: 'th-8',
        question: 'Khi lập trình giao diện bài thi tương thích cả điện thoại và máy tính, kỹ thuật nào được áp dụng phổ biến nhất trong CSS?',
        options: [
          'Fixed Absolute Layout',
          'Media Queries (Responsive Web Design)',
          'HTML FrameSet',
          'Browser Flash Plugin'
        ],
        correctAnswer: 1,
        explanation: 'CSS Media Queries (@media (max-width: ...)) là tiêu chuẩn của Responsive Web Design giúp giao diện tự động co giãn tối ưu trên mọi màn hình.',
        difficulty: 'Trung bình'
      },
      {
        id: 'th-9',
        question: 'Trong các thuật ngữ máy tính, 1 Megabyte (MB) quy đổi chuẩn xác theo hệ nhị phân bằng bao nhiêu Kilobyte (KB)?',
        options: [
          '1000 KB',
          '1024 KB',
          '1048576 KB',
          '512 KB'
        ],
        correctAnswer: 1,
        explanation: 'Theo hệ nhị phân (2^10), 1 Megabyte bằng chính xác 1024 Kilobyte (KB).',
        difficulty: 'Dễ'
      },
      {
        id: 'th-10',
        question: 'Một trang web dạng "Single File Standalone HTML" có ưu điểm nổi bật nhất là gì?',
        options: [
          'Yêu cầu kết nối mạng băng thông rộng liên tục',
          'Chứa toàn bộ mã HTML, CSS và JavaScript trong 1 file duy nhất, chỉ cần click đúp mở chạy offline ngay',
          'Bắt buộc cài đặt NodeJS và máy chủ Apache trên máy tính',
          'Không thể chạy trên hệ điều hành Windows'
        ],
        correctAnswer: 1,
        explanation: 'Tệp HTML độc lập nhúng sẵn style và script giúp bài thi có thể copy qua USB, chạy offline trực tiếp trên mọi trình duyệt mà không cần cài thêm phần mềm hay có mạng.',
        difficulty: 'Dễ'
      }
    ]
  },
  {
    id: 'exam-toan-01',
    title: 'Toán Học & Tư Duy Logic Tổng Hợp',
    subject: 'Toán học',
    grade: 'THPT / Tuyển sinh',
    description: 'Bộ câu hỏi rèn luyện tư duy toán học, hàm số, xác suất cơ bản và tính toán logic nhanh.',
    durationMinutes: 20,
    createdAt: '2026-03-02',
    questions: [
      {
        id: 'toan-1',
        question: 'Nghiệm của phương trình bậc nhất 3x - 12 = 0 là bao nhiêu?',
        options: [
          'x = -4',
          'x = 3',
          'x = 4',
          'x = 12'
        ],
        correctAnswer: 2,
        explanation: '3x - 12 = 0 => 3x = 12 => x = 12 / 3 = 4.',
        difficulty: 'Dễ'
      },
      {
        id: 'toan-2',
        question: 'Đạo hàm của hàm số y = x³ - 4x² + 5x - 7 là gì?',
        options: [
          'y\' = 3x² - 8x + 5',
          'y\' = 3x² - 4x + 5',
          'y\' = x² - 8x + 5',
          'y\' = 3x² - 8x'
        ],
        correctAnswer: 0,
        explanation: 'Theo công thức (x^n)\' = n*x^(n-1): (x³)\' = 3x², (-4x²)\' = -8x, (5x)\' = 5, (-7)\' = 0. Vậy y\' = 3x² - 8x + 5.',
        difficulty: 'Trung bình'
      },
      {
        id: 'toan-3',
        question: 'Gieo một con xúc xắc cân đối đồng chất 6 mặt một lần. Xác suất để xuất hiện mặt có số chấm là số nguyên tố là bao nhiêu?',
        options: [
          '1/6',
          '1/3',
          '1/2',
          '2/3'
        ],
        correctAnswer: 2,
        explanation: 'Không gian mẫu gồm {1, 2, 3, 4, 5, 6} có 6 phần tử. Các số nguyên tố là {2, 3, 5} có 3 trường hợp thuận lợi. Xác suất P = 3/6 = 1/2.',
        difficulty: 'Trung bình'
      },
      {
        id: 'toan-4',
        question: 'Diện tích của hình chữ nhật có chiều dài 8 cm và chu vi là 28 cm là bao nhiêu cm²?',
        options: [
          '48 cm²',
          '36 cm²',
          '56 cm²',
          '64 cm²'
        ],
        correctAnswer: 0,
        explanation: 'Nửa chu vi = 28 / 2 = 14 cm. Chiều rộng = 14 - 8 = 6 cm. Diện tích = 8 × 6 = 48 cm².',
        difficulty: 'Dễ'
      },
      {
        id: 'toan-5',
        question: 'Giá trị của log₂ (32) bằng bao nhiêu?',
        options: [
          '4',
          '5',
          '6',
          '16'
        ],
        correctAnswer: 1,
        explanation: 'Do 2⁵ = 32 nên log₂(32) = 5.',
        difficulty: 'Dễ'
      },
      {
        id: 'toan-6',
        question: 'Trong mặt phẳng tọa độ Oxy, khoảng cách giữa hai điểm A(1, 2) và B(4, 6) bằng bao nhiêu?',
        options: [
          '3',
          '4',
          '5',
          '7'
        ],
        correctAnswer: 2,
        explanation: 'Khoảng cách AB = √[(4-1)² + (6-2)²] = √[3² + 4²] = √[9 + 16] = √25 = 5.',
        difficulty: 'Trung bình'
      },
      {
        id: 'toan-7',
        question: 'Số tổ hợp chập 2 của 5 phần tử, ký hiệu C(5, 2), có giá trị là bao nhiêu?',
        options: [
          '10',
          '20',
          '15',
          '120'
        ],
        correctAnswer: 0,
        explanation: 'C(5, 2) = 5! / (2! * 3!) = (5 * 4) / 2 = 10.',
        difficulty: 'Trung bình'
      },
      {
        id: 'toan-8',
        question: 'Một cửa hàng giảm giá một chiếc áo 20%, sau đó bán với giá 320.000 VNĐ. Giá ban đầu của chiếc áo trước khi giảm là bao nhiêu?',
        options: [
          '384.000 VNĐ',
          '400.000 VNĐ',
          '360.000 VNĐ',
          '420.000 VNĐ'
        ],
        correctAnswer: 1,
        explanation: 'Giá sau giảm = 80% giá gốc => Giá ban đầu = 320.000 / 0.8 = 400.000 VNĐ.',
        difficulty: 'Dễ'
      },
      {
        id: 'toan-9',
        question: 'Tập xác định của hàm số y = 1 / √(x - 3) là:',
        options: [
          'D = [3; +∞)',
          'D = (3; +∞)',
          'D = (-∞; 3)',
          'D = R \\ {3}'
        ],
        correctAnswer: 1,
        explanation: 'Điều kiện xác định: Biểu thức dưới căn mẫu số phải dương nghiêm ngặt: x - 3 > 0 <=> x > 3. Tập xác định D = (3; +∞).',
        difficulty: 'Trung bình'
      },
      {
        id: 'toan-10',
        question: 'Nếu 5 công nhân hoàn thành một công việc trong 12 ngày, thì 10 công nhân (với cùng năng suất) sẽ hoàn thành công việc đó trong bao nhiêu ngày?',
        options: [
          '24 ngày',
          '6 ngày',
          '4 ngày',
          '10 ngày'
        ],
        correctAnswer: 1,
        explanation: 'Số công nhân tăng gấp đôi (từ 5 lên 10) thì thời gian hoàn thành giảm đi một nửa: 12 / 2 = 6 ngày (tỉ lệ nghịch).',
        difficulty: 'Dễ'
      }
    ]
  },
  {
    id: 'exam-tieng-anh-01',
    title: 'Tiếng Anh - Ngữ Pháp & Từ Vựng Chuẩn B1 - B2',
    subject: 'Tiếng Anh',
    grade: 'Trung học cơ sở & THPT',
    description: 'Kiểm tra năng lực thì động từ, câu điều kiện, giới từ và từ vựng thông dụng trong giao tiếp quốc tế.',
    durationMinutes: 15,
    createdAt: '2026-03-03',
    questions: [
      {
        id: 'en-1',
        question: 'Choose the correct form: "She _______ English for five years before she moved to London."',
        options: [
          'has studied',
          'had studied',
          'studies',
          'was studying'
        ],
        correctAnswer: 1,
        explanation: 'Hành động xảy ra và kéo dài trước một hành động khác trong quá khứ ("before she moved") sử dụng thì Quá khứ hoàn thành (Past Perfect: had + V3/ed).',
        difficulty: 'Trung bình'
      },
      {
        id: 'en-2',
        question: 'If it _______ tomorrow, we will postpone the outdoor sports festival.',
        options: [
          'rains',
          'will rain',
          'rained',
          'would rain'
        ],
        correctAnswer: 0,
        explanation: 'Câu điều kiện loại 1 (Conditional Sentence Type 1): Mệnh đề If dùng thì Hiện tại đơn (rains), mệnh đề chính dùng will + V-inf.',
        difficulty: 'Dễ'
      },
      {
        id: 'en-3',
        question: 'The book _______ was recommended by our teacher is very helpful.',
        options: [
          'who',
          'whom',
          'which',
          'whose'
        ],
        correctAnswer: 2,
        explanation: '"The book" là danh từ chỉ vật làm chủ ngữ trong mệnh đề quan hệ, do đó đại từ quan hệ phù hợp là "which" hoặc "that".',
        difficulty: 'Dễ'
      },
      {
        id: 'en-4',
        question: 'Choose the word that is CLOSEST in meaning to "rapidly":',
        options: [
          'Slowly',
          'Quickly',
          'Carefully',
          'Hardly'
        ],
        correctAnswer: 1,
        explanation: '"Rapidly" mang nghĩa là nhanh chóng, mau lẹ, đồng nghĩa với "quickly".',
        difficulty: 'Dễ'
      },
      {
        id: 'en-5',
        question: 'I am really looking forward to _______ from you soon.',
        options: [
          'hear',
          'hearing',
          'heard',
          'have heard'
        ],
        correctAnswer: 1,
        explanation: 'Cấu trúc "look forward to + V-ing" có nghĩa là trông mong, ngóng đợi điều gì đó.',
        difficulty: 'Dễ'
      },
      {
        id: 'en-6',
        question: 'Neither Tom nor his classmates _______ attending the conference yesterday.',
        options: [
          'was',
          'were',
          'is',
          'are'
        ],
        correctAnswer: 1,
        explanation: 'Cấu trúc "Neither... nor..." động từ chia theo chủ ngữ gần nó nhất ("his classmates" số nhiều). Thời điểm quá khứ ("yesterday") nên dùng "were".',
        difficulty: 'Khó'
      },
      {
        id: 'en-7',
        question: 'He has lived in Da Nang _______ 2018.',
        options: [
          'for',
          'since',
          'in',
          'at'
        ],
        correctAnswer: 1,
        explanation: '"Since" dùng với mốc thời gian cụ thể trong quá khứ (since 2018), còn "for" dùng với khoảng thời gian (ví dụ: for 8 years).',
        difficulty: 'Dễ'
      },
      {
        id: 'en-8',
        question: 'Choose the word OPPOSITE in meaning to "generous":',
        options: [
          'Selfish / Mean',
          'Kind',
          'Polite',
          'Brave'
        ],
        correctAnswer: 0,
        explanation: '"Generous" (hào phóng, rộng lượng) trái nghĩa với "Selfish / Mean" (ích kỷ, keo kiệt).',
        difficulty: 'Trung bình'
      },
      {
        id: 'en-9',
        question: 'Unless you _______ hard, you will not pass the entrance examination.',
        options: [
          'study',
          'will study',
          'not study',
          'studied'
        ],
        correctAnswer: 0,
        explanation: '"Unless" = "If not". Mệnh đề sau unless mang tính khẳng định ở thì hiện tại đơn: "Unless you study hard" (Trừ khi bạn học chăm chỉ).',
        difficulty: 'Dễ'
      },
      {
        id: 'en-10',
        question: 'This is the most interesting movie I have _______ seen.',
        options: [
          'never',
          'ever',
          'already',
          'yet'
        ],
        correctAnswer: 1,
        explanation: 'Trong cấu trúc so sánh nhất (the most...), từ "ever" thường được dùng trong thì hiện tại hoàn thành để nhấn mạnh "từng xem".',
        difficulty: 'Dễ'
      }
    ]
  },
  {
    id: 'exam-khoa-hoc-01',
    title: 'Khoa Học Tự Nhiên, Vật Lý & Đời Sống',
    subject: 'Khoa học Tự nhiên',
    grade: 'THCS & Đời sống',
    description: 'Các câu hỏi về vật lý thường thức, cơ học, quang học, năng lượng và các hiện tượng tự nhiên quanh ta.',
    durationMinutes: 15,
    createdAt: '2026-03-04',
    questions: [
      {
        id: 'kh-1',
        question: 'Vận tốc truyền âm thanh trong môi trường nào sau đây là nhanh nhất?',
        options: [
          'Chân không',
          'Không khí',
          'Nước lỏng',
          'Chất rắn (như Thép, Kim loại)'
        ],
        correctAnswer: 3,
        explanation: 'Âm thanh truyền nhanh nhất trong chất rắn, tiếp đến chất lỏng, chậm hơn trong chất khí và không truyền được trong chân không.',
        difficulty: 'Dễ'
      },
      {
        id: 'kh-2',
        question: 'Hiện tượng cầu vồng xuất hiện sau cơn mưa chủ yếu là do hiện tượng quang học nào gây ra?',
        options: [
          'Phản xạ toàn phần đơn thuần',
          'Tán sắc ánh sáng mặt trời qua các giọt nước',
          'Nhiễu xạ ánh sáng',
          'Giao thoa ánh sáng laser'
        ],
        correctAnswer: 1,
        explanation: 'Ánh sáng trắng từ Mặt Trời khi đi qua các giọt nước mưa lơ lửng bị khúc xạ và tán sắc thành dải quang phổ 7 màu liên tục tạo thành cầu vồng.',
        difficulty: 'Dễ'
      },
      {
        id: 'kh-3',
        question: 'Đơn vị đo lực trong hệ thống đo lường quốc tế (SI) là gì?',
        options: [
          'Joule (J)',
          'Newton (N)',
          'Watt (W)',
          'Pascal (Pa)'
        ],
        correctAnswer: 1,
        explanation: 'Newton (kí hiệu N) là đơn vị đo lực trong hệ SI, được đặt theo tên nhà bác học Isaac Newton.',
        difficulty: 'Dễ'
      },
      {
        id: 'kh-4',
        question: 'Khí nào chiếm tỉ lệ thể tích lớn nhất trong bầu khí quyển Trái Đất của chúng ta?',
        options: [
          'Khí Oxy (O₂)',
          'Khí Nitơ (N₂)',
          'Khí Cacbonic (CO₂)',
          'Khí Argon (Ar)'
        ],
        correctAnswer: 1,
        explanation: 'Khí Nitơ (N₂) chiếm khoảng 78% thể tích khí quyển, tiếp theo là Oxy (O₂) khoảng 21%, còn lại là các khí khác.',
        difficulty: 'Dễ'
      },
      {
        id: 'kh-5',
        question: 'Khi một vật rơi tự do trong điều kiện bỏ qua sức cản không khí, đại lượng nào sau đây là không đổi?',
        options: [
          'Vận tốc rơi của vật',
          'Gia tốc trọng trường',
          'Quãng đường vật đi được trong mỗi giây',
          'Động năng của vật'
        ],
        correctAnswer: 1,
        explanation: 'Rơi tự do là chuyển động thẳng nhanh dần đều với gia tốc trọng trường g không đổi (g ≈ 9.8 m/s²).',
        difficulty: 'Trung bình'
      },
      {
        id: 'kh-6',
        question: 'Công thức tính công cơ học A khi lực F cùng hướng với quãng đường dịch chuyển s là gì?',
        options: [
          'A = F / s',
          'A = F × s',
          'A = m × g',
          'A = F + s'
        ],
        correctAnswer: 1,
        explanation: 'Công cơ học được tính bằng tích độ lớn của lực tác dụng và quãng đường dịch chuyển theo phương của lực: A = F × s (đơn vị là Joule).',
        difficulty: 'Dễ'
      },
      {
        id: 'kh-7',
        question: 'Gương cầu lồi thường được sử dụng làm gương chiếu hậu trên xe ô tô, xe máy vì lý do gì?',
        options: [
          'Cho ảnh thật lớn hơn vật',
          'Cho vùng quan sát (thị trường) rộng hơn so với gương phẳng cùng kích thước',
          'Hấp thụ ánh sáng chói mắt tốt hơn',
          'Tạo ra nhiệt lượng làm khô sương mù'
        ],
        correctAnswer: 1,
        explanation: 'Gương cầu lồi cho ảnh ảo cùng chiều, nhỏ hơn vật nên có vùng nhìn thấy (thị trường) rộng hơn nhiều so với gương phẳng, giúp lái xe quan sát góc rộng.',
        difficulty: 'Trung bình'
      },
      {
        id: 'kh-8',
        question: 'Trọng lượng P của một vật có khối lượng m = 5 kg trên bề mặt Trái Đất (lấy gia tốc g = 9.8 m/s²) xấp xỉ bằng bao nhiêu?',
        options: [
          '49 N',
          '5 N',
          '0.51 N',
          '98 N'
        ],
        correctAnswer: 0,
        explanation: 'Công thức tính trọng lượng: P = m × g = 5 × 9.8 = 49 N.',
        difficulty: 'Dễ'
      },
      {
        id: 'kh-9',
        question: 'Kim loại nào sau đây ở trạng thái lỏng ở nhiệt độ phòng (25°C)?',
        options: [
          'Chì (Pb)',
          'Thủy ngân (Hg)',
          'Nhôm (Al)',
          'Đồng (Cu)'
        ],
        correctAnswer: 1,
        explanation: 'Thủy ngân (Hg) là kim loại duy nhất tồn tại ở thể lỏng ở nhiệt độ phòng bình thường, với nhiệt độ nóng chảy là -38.83°C.',
        difficulty: 'Dễ'
      },
      {
        id: 'kh-10',
        question: 'Năng lượng mặt trời, năng lượng gió và thủy điện thuộc nhóm năng lượng nào sau đây?',
        options: [
          'Năng lượng hóa thạch',
          'Năng lượng không thể tái tạo',
          'Năng lượng tái tạo (Năng lượng sạch)',
          'Năng lượng phóng xạ hạt nhân'
        ],
        correctAnswer: 2,
        explanation: 'Mặt trời, gió, nước là các nguồn tài nguyên vô tận trong tự nhiên, được xếp vào nhóm nguồn năng lượng tái tạo thân thiện với môi trường.',
        difficulty: 'Dễ'
      }
    ]
  },
  {
    id: 'exam-lich-su-01',
    title: 'Lịch Sử & Địa Lý Văn Hóa Việt Nam',
    subject: 'Lịch sử & Địa lý',
    grade: 'Phổ thông tổng hợp',
    description: 'Kiểm tra hiểu biết về lịch sử dựng nước, giữ nước, danh lam thắng cảnh và địa lý các vùng miền Việt Nam.',
    durationMinutes: 15,
    createdAt: '2026-03-05',
    questions: [
      {
        id: 'ls-1',
        question: 'Chiến thắng lịch sử Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào?',
        options: [
          'Năm 1945',
          'Năm 1954',
          'Năm 1975',
          'Năm 1968'
        ],
        correctAnswer: 1,
        explanation: 'Chiến thắng Điện Biên Phủ toàn thắng vào ngày 7 tháng 5 năm 1954, kết thúc thắng lợi cuộc kháng chiến chống thực dân Pháp.',
        difficulty: 'Dễ'
      },
      {
        id: 'ls-2',
        question: 'Đỉnh núi nào được mệnh danh là "Nóc nhà của Đông Dương" với độ cao 3.143 mét?',
        options: [
          'Đỉnh Fansipan (Phan Xi Păng)',
          'Đỉnh Tây Côn Lĩnh',
          'Đỉnh Langbiang',
          'Đỉnh Bạch Mộc Lương Tử'
        ],
        correctAnswer: 0,
        explanation: 'Đỉnh Fansipan thuộc dãy Hoàng Liên Sơn, tỉnh Lào Cai, cao 3.143m là đỉnh núi cao nhất 3 nước Đông Dương (Việt Nam, Lào, Campuchia).',
        difficulty: 'Dễ'
      },
      {
        id: 'ls-3',
        question: 'Vịnh Hạ Long, di sản thiên nhiên thế giới được UNESCO công nhận, nằm ở tỉnh thành nào của nước ta?',
        options: [
          'Hải Phòng',
          'Quảng Ninh',
          'Ninh Bình',
          'Đà Nẵng'
        ],
        correctAnswer: 1,
        explanation: 'Vịnh Hạ Long là vịnh biển thuộc tỉnh Quảng Ninh, nổi tiếng với hàng nghìn hòn đảo đá vôi kỳ vĩ.',
        difficulty: 'Dễ'
      },
      {
        id: 'ls-4',
        question: 'Ai là vị vua sáng lập nên triều đại nhà Lý và dời đô từ Hoa Lư về Đại La (nay là Hà Nội) vào năm 1010?',
        options: [
          'Lý Thường Kiệt',
          'Lý Thái Tổ (Lý Công Uẩn)',
          'Lý Thánh Tông',
          'Lý Nhân Tông'
        ],
        correctAnswer: 1,
        explanation: 'Năm 1010, vua Lý Thái Tổ (Lý Công Uẩn) ban Chiếu dời đô chuyển kinh đô từ Hoa Lư (Ninh Bình) về thành Đại La và đổi tên thành Thăng Long.',
        difficulty: 'Dễ'
      },
      {
        id: 'ls-5',
        question: 'Sông Mê Kông khi chảy vào lãnh thổ Việt Nam được chia thành hai nhánh chính là sông Tiền và sông gì?',
        options: [
          'Sông Hậu',
          'Sông Đồng Nai',
          'Sông Sài Gòn',
          'Sông Vàm Cỏ'
        ],
        correctAnswer: 0,
        explanation: 'Khi chảy vào đồng bằng sông Cửu Long của Việt Nam, sông Mê Kông tách ra làm 2 dòng chính là sông Tiền và sông Hậu.',
        difficulty: 'Dễ'
      },
      {
        id: 'ls-6',
        question: 'Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam được kỷ niệm vào ngày nào hằng năm?',
        options: [
          'Ngày 30 tháng 4',
          'Ngày 2 tháng 9',
          'Ngày 1 tháng 5',
          'Ngày 19 tháng 8'
        ],
        correctAnswer: 1,
        explanation: 'Ngày 2 tháng 9 năm 1945, tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa.',
        difficulty: 'Dễ'
      },
      {
        id: 'ls-7',
        question: 'Tỉnh nào sau đây có diện tích tự nhiên lớn nhất cả nước theo số liệu thống kê địa lý Việt Nam?',
        options: [
          'Thanh Hóa',
          'Nghệ An',
          'Sơn La',
          'Đắk Lắk'
        ],
        correctAnswer: 1,
        explanation: 'Nghệ An là tỉnh có diện tích lớn nhất Việt Nam với hơn 16.490 km².',
        difficulty: 'Trung bình'
      },
      {
        id: 'ls-8',
        question: 'Trận chiến trên sông Bạch Đằng năm 938 do ai lãnh đạo đã chấm dứt hơn 1000 năm Bắc thuộc?',
        options: [
          'Đinh Bộ Lĩnh',
          'Ngô Quyền',
          'Lê Hoàn',
          'Trần Hưng Đạo'
        ],
        correctAnswer: 1,
        explanation: 'Năm 938, Ngô Quyền chỉ huy quân dân đánh tan quân Nam Hán trên sông Bạch Đằng bằng chiến thuật cọc gỗ bịt sắt, mở ra kỷ nguyên độc lập lâu dài.',
        difficulty: 'Dễ'
      },
      {
        id: 'ls-9',
        question: 'Hang động tự nhiên lớn nhất thế giới hiện nay được khám phá tại Vườn quốc gia Phong Nha - Kẻ Bàng (Quảng Bình) có tên là gì?',
        options: [
          'Hang Én',
          'Hang Sơn Đoòng',
          'Động Thiên Đường',
          'Hang Tiên'
        ],
        correctAnswer: 1,
        explanation: 'Hang Sơn Đoòng được Hiệp hội nghiên cứu hang động Hoàng gia Anh khám phá và công nhận là hang động tự nhiên lớn nhất hành tinh.',
        difficulty: 'Dễ'
      },
      {
        id: 'ls-10',
        question: 'Tác phẩm văn học trung đại bất hủ "Truyện Kiều" (Đoạn trường tân thanh) là kiệt tác của danh nhân văn hóa nào?',
        options: [
          'Nguyễn Trãi',
          'Đại thi hào Nguyễn Du',
          'Hồ Xuân Hương',
          'Nguyễn Bỉnh Khiêm'
        ],
        correctAnswer: 1,
        explanation: 'Truyện Kiều gồm 3254 câu thơ lục bát do Đại thi hào dân tộc - Danh nhân văn hóa thế giới Nguyễn Du sáng tác.',
        difficulty: 'Dễ'
      }
    ]
  }
];
