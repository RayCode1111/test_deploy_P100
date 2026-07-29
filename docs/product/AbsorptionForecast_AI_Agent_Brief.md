

**PRODUCT / PROJECT BRIEF**

Loại đề tài:  **AI Agent phân tích & dự báo (Forecasting / Decision-support Agent)**

Lĩnh vực:  **Bất động sản – Kinh doanh & Quản lý bán hàng dự án căn hộ**

Ngày lập brief:  **29/07/2026**

# **1\. Tổng quan dự án**

| Tên đề tài | AbsorptionForecast AI Agent – Trợ lý dự báo tồn kho & tốc độ hấp thụ căn hộ |
| :---- | :---- |
| **Loại đề tài** | AI Agent phân tích dữ liệu & dự báo chuỗi thời gian, có giải thích (explainable) và đề xuất hành động |
| **Ngành / Lĩnh vực** | Bất động sản – Kinh doanh, quản lý bán hàng dự án căn hộ |
| **Product Owner** | G21 - T100 - Nguyễn Đức Đạt, Bùi Hoàng Vương, Nguyện Trọng Nam, Đặng Tiến Thành |

# **2\. Bối cảnh & vấn đề kinh doanh**

## **2.1 Bối cảnh**

Trong các dự án bất động sản chung cư / khu đô thị quy mô lớn, sản phẩm thường được chia thành nhiều phân khu và loại căn hộ khác nhau (diện tích, hướng, tầng, số phòng ngủ...). Tốc độ bán hàng — hay tốc độ hấp thụ — giữa các phân khu và loại căn thường không đồng đều: có loại "cháy hàng" rất nhanh, có loại tồn kho kéo dài không bán được.

Ban kinh doanh cần liên tục nắm bắt phân khu / loại căn nào sắp hết hàng để cân nhắc điều chỉnh chính sách giá, siết ưu đãi, và phân khu / loại căn nào đang bán chậm để tập trung nguồn lực sale, đẩy chính sách kích cầu kịp thời.

Hiện tại việc theo dõi này chủ yếu dựa vào kinh nghiệm và cảm tính của quản lý kinh doanh, kết hợp với các bảng báo cáo Excel tổng hợp thủ công — vốn cập nhật chậm và thiếu tính hệ thống.

## **2.2 Vấn đề cần giải quyết**

Vấn đề của Ban kinh doanh thực chất là 3 pain point có quan hệ nhân — quả, không phải 3 mục tiêu ngang hàng: 1 pain point nền tảng (gốc) và 2 pain point nghiệp vụ cốt lõi (đầu ra).

* Pain point nền tảng — Dữ liệu phi tập trung: dữ liệu bán hàng & tồn kho nằm rải rác ở nhiều nguồn (Excel, CRM, báo cáo tay...), không có một nguồn sự thật duy nhất (single source of truth), nên không thể nhìn được trạng thái thực theo thời gian thực. Đây là gốc rễ khiến 2 pain point nghiệp vụ bên dưới không được phát hiện kịp thời.  
* Pain point nghiệp vụ \#1 — Fast-moving / sắp cạn hàng: cần biết ngay căn nào đang bán quá nhanh để giữ giá hoặc siết ưu đãi kịp thời, tránh bán rẻ hàng đang có nhu cầu cao.  
* Pain point nghiệp vụ \#2 — Slow-moving / bán chậm: cần biết căn nào tồn lâu, hấp thụ chậm để đẩy hàng hoặc đổi chiến thuật bán trước khi tồn kho kéo dài quá lâu.

Trong phạm vi MVP, pain point nền tảng (dữ liệu phi tập trung) được chọn làm lõi giải quyết trước; 2 pain point nghiệp vụ (fast-moving, slow-moving) là 2 tín hiệu / nhãn đầu ra mà hệ thống nhận diện được ngay khi dữ liệu đã tập trung — không tách thành các mục tiêu độc lập, để tránh phình phạm vi sang cả forecasting chi tiết, optimization và workflow phê duyệt cùng một lúc.

## **2.3 Tác động nếu không giải quyết**

* **Chậm ra quyết định:** chính sách giá / chiết khấu được điều chỉnh chậm trễ, thiếu cơ sở dữ liệu định lượng.

* **Bỏ lỡ thời điểm tối ưu:** chậm tăng giá khi cầu cao, hoặc chậm kích cầu khi hàng tồn kho lâu ngày.

* **Lãng phí nguồn lực sale:** phân bổ nhân sự tư vấn không dựa trên dữ liệu thực tế về tốc độ bán.

# **3\. Mục tiêu & kết quả kỳ vọng**

**O1. Rút ngắn thời gian phát hiện & phản ứng với biến động tốc độ hấp thụ**

* *Baseline:* Theo dõi tốc độ bán dựa trên báo cáo Excel tổng hợp thủ công, cập nhật theo tuần / theo đợt; độ trễ phát hiện một phân khu bán chậm có thể lên tới nhiều ngày (số ngày cụ thể cần xác nhận qua khảo sát pain point ở Tuần 1).  
* *Chỉ tiêu (SMART):* Dashboard cập nhật tối thiểu 1-2 lần/ngày; độ trễ từ khi dữ liệu bán hàng phát sinh đến khi hệ thống phát hiện & cảnh báo bất thường tồn kho giảm xuống dưới 24 giờ.  
* *Bằng chứng / Cơ sở:* Theo báo cáo thị trường nhà ở 6 tháng đầu năm 2026 của DXS-FERI, dù nguồn cung mới tăng 16% so với cùng kỳ, lượng tiêu thụ toàn thị trường lại giảm tới 62% so với nửa cuối năm 2025 — tốc độ hấp thụ có thể đảo chiều rất nhanh, phát hiện chậm đồng nghĩa bỏ lỡ thời điểm điều chỉnh chính sách.

**O2. Tối ưu đối tượng & mức áp dụng chiết khấu, chính sách kích cầu**

* *Baseline:* Nhiều chủ đầu tư hiện áp dụng chiết khấu ở mức cao (phổ biến 10–30%, một số chương trình lên tới khoảng 30%) trên diện rộng để kích thích thanh khoản, chưa phân biệt rõ phân khu / loại căn nào thực sự cần hỗ trợ.  
* *Chỉ tiêu (SMART):* Agent xác định đúng nhóm phân khu / loại căn có nguy cơ tồn kho thực sự dựa trên tốc độ hấp thụ dự báo; mục tiêu pilot là giảm số phân khu phải nhận mức chiết khấu tối đa so với cách làm đại trà hiện tại, trên cùng một dự án thử nghiệm.  
* *Bằng chứng / Cơ sở:* Tổng hợp báo cáo thị trường đầu năm 2026 (StockBiz, CafeBiz) cho thấy chủ đầu tư phổ biến chiết khấu 10–30%, có chương trình chiết khấu tới 11% cho thanh toán sớm trong 15 ngày — cho thấy dư địa tối ưu chi phí chiết khấu nếu nhắm đúng đối tượng thay vì áp dụng tràn lan.

**O3. Cải thiện tỷ lệ hấp thụ (absorption rate) tại các phân khu được theo dõi**

* *Baseline:* Tỷ lệ hấp thụ bình quân toàn thị trường 6 tháng đầu năm 2026 vào khoảng 70% (\~26.000 trên tổng số \~37.300 sản phẩm mở bán mới được tiêu thụ).  
* *Chỉ tiêu (SMART):* Trong giai đoạn pilot, so sánh tỷ lệ hấp thụ giữa nhóm phân khu có áp dụng đề xuất hành động của Agent và nhóm không áp dụng (thiết kế A/B); mục tiêu nhóm có can thiệp đạt tỷ lệ hấp thụ cao hơn baseline ngành, mức chênh lệch cụ thể xác định sau khi có dữ liệu pilot thực tế.  
* *Bằng chứng / Cơ sở:* Baseline ngành theo báo cáo thị trường nhà ở 6 tháng đầu năm 2026 (DXS-FERI); đây là chỉ số đo lường trực tiếp bằng dữ liệu bán hàng thực tế của dự án pilot, không phụ thuộc khảo sát định tính.

**O4. Nâng cao độ chính xác dự báo so với ước tính cảm tính**

* *Baseline:* Dự báo hiện dựa hoàn toàn vào kinh nghiệm / cảm tính của quản lý kinh doanh, không được đo lường sai số một cách hệ thống, không có cơ sở để cải thiện qua thời gian.  
* *Chỉ tiêu (SMART):* Mô hình dự báo (Prophet \+ Agent) có sai số (MAPE) được đo lường và công bố sau mỗi chu kỳ đánh giá, cải thiện liên tục qua các lần huấn luyện lại; 100% dự báo có kèm khoảng tin cậy rõ ràng.  
* *Bằng chứng / Cơ sở:* Một nghiên cứu trên hơn 60.000 dự báo tại 4 công ty chuỗi cung ứng (Fildes et al., *International Journal of Forecasting*) cho thấy 75% dự báo bị điều chỉnh theo cảm tính nhưng phần lớn điều chỉnh nhỏ làm giảm độ chính xác; một nghiên cứu khác ghi nhận việc kết hợp dự báo thống kê với quy tắc điều chỉnh có kỷ luật giúp cải thiện 3–11 điểm phần trăm độ chính xác so với điều chỉnh cảm tính không kiểm soát.

**O5. Đảm bảo 100% quyết định chính sách có kiểm soát của con người (HITL)**

* *Baseline:* Quyết định hiện hoàn toàn do con người thực hiện thủ công; khi có AI Agent hỗ trợ, phát sinh rủi ro mới là khả năng tự động hoá vượt tầm kiểm soát nếu không thiết kế đúng.  
* *Chỉ tiêu (SMART):* 100% đề xuất chính sách giá / chiết khấu từ Agent được quản lý kinh doanh phê duyệt trước khi áp dụng; 0 trường hợp chính sách tự động thực thi mà không qua duyệt, kiểm tra được qua log hệ thống.  
* *Bằng chứng / Cơ sở:* Ràng buộc bắt buộc theo yêu cầu đề tài (Mục 9 – Ràng buộc); chỉ tiêu 100%/0 trường hợp là chỉ số kiểm toán (audit) khả thi, đo lường được ngay từ giai đoạn MVP.

# **4\. Đối tượng người dùng**

| Nhân viên kinh doanh(Sales Staff) | Theo dõi tốc độ bán theo phân khu / loại căn phụ trách; nhận cảnh báo khi căn hộ sắp cạn hàng để chủ động tư vấn khách. |
| :---- | :---- |
| **Quản lý kinh doanh(Sales Manager)** | Xem báo cáo tổng hợp toàn dự án; duyệt hoặc từ chối các đề xuất dự báo và hành động chính sách trước khi áp dụng (HITL). |
| **Ban điều hành / Lãnh đạo dự án** | Theo dõi báo cáo tổng quan định kỳ để ra quyết định chiến lược (giá bán, tiến độ mở bán các giai đoạn tiếp theo). |

# **5\. Phạm vi giải pháp**

## **5.1 Giai đoạn 1 – Cơ bản (MVP)**

* Ứng dụng web dành cho nhân viên kinh doanh và quản lý kinh doanh.

* Nạp dữ liệu bán hàng & tồn kho (import file Excel/CSV định kỳ, hoặc kết nối trực tiếp CRM nội bộ).

* Tính toán & hiển thị tốc độ hấp thụ theo phân khu / loại căn (biểu đồ xu hướng theo thời gian).

* Cảnh báo tự động khi phát hiện nguy cơ cạn hàng (ngày dự kiến hết hàng theo từng phân khu / loại căn).

* Giải thích cơ bản, bằng ngôn ngữ tự nhiên (do LLM sinh), về các yếu tố ảnh hưởng đến tốc độ bán.

* Luồng phê duyệt HITL cơ bản: quản lý kinh doanh xem, duyệt hoặc từ chối dự báo / đề xuất trước khi áp dụng.

## **5.2 Giai đoạn 2 – Nâng cao**

* Agent tự động lựa chọn và so sánh nhiều mô hình dự báo (Prophet, ARIMA, mô hình học máy khác), chọn mô hình phù hợp nhất theo từng phân khu / loại căn.

* Mô phỏng tác động của thay đổi chính sách / giá (what-if analysis) trước khi áp dụng thực tế.

* Gợi ý và xếp hạng ưu tiên đẩy hàng tự động theo mức độ rủi ro tồn kho.

* Cảnh báo chủ động qua đa kênh (email, Zalo, Slack...) thay vì chỉ hiển thị trên dashboard.

* Theo dõi và đánh giá sai số dự báo theo thời gian (MAPE), tự động đề xuất tinh chỉnh / huấn luyện lại mô hình.

# **6\. Yêu cầu chức năng & User Stories**

| ID | User Story | Tiêu chí chấp nhận | Ưu tiên |
| :---- | :---- | :---- | :---- |
| **FR-01** | Là nhân viên kinh doanh, tôi muốn xem tốc độ hấp thụ của phân khu / loại căn mình phụ trách để biết căn nào cần tư vấn gấp. | Dashboard hiển thị tốc độ hấp thụ theo phân khu / loại căn, cập nhật ít nhất 1 lần/ngày. | **MVP** |
| **FR-02** | Là nhân viên kinh doanh, tôi muốn nhận cảnh báo khi một loại căn sắp hết hàng để chủ động tư vấn khách. | Hệ thống cảnh báo trong app khi tồn kho dự kiến dưới ngưỡng ngày quy định. | **MVP** |
| **FR-03** | Là quản lý kinh doanh, tôi muốn xem giải thích các yếu tố ảnh hưởng đến tốc độ bán để hiểu nguyên nhân. | Mỗi dự báo có đoạn giải thích bằng ngôn ngữ tự nhiên, liệt kê yếu tố chính. | **MVP** |
| **FR-04** | Là quản lý kinh doanh, tôi muốn duyệt hoặc từ chối đề xuất chính sách trước khi áp dụng. | Đề xuất chỉ có hiệu lực sau khi quản lý xác nhận duyệt (HITL). | **MVP** |
| **FR-05** | Là quản lý kinh doanh, tôi muốn xem khoảng tin cậy của mỗi dự báo để đánh giá độ rủi ro. | Mỗi số liệu dự báo hiển thị kèm khoảng tin cậy (ví dụ 90%). | **MVP** |
| **FR-06** | Là Agent, tôi cần tự động lựa chọn mô hình dự báo phù hợp nhất cho từng phân khu. | Agent so sánh từ 2 mô hình trở lên, chọn mô hình có MAPE thấp nhất. | **Nâng cao** |
| **FR-07** | Là quản lý kinh doanh, tôi muốn mô phỏng tác động thay đổi giá trước khi quyết định. | Cho phép nhập kịch bản giá / chính sách và xem dự báo tốc độ bán thay đổi tương ứng. | **Nâng cao** |
| **FR-08** | Là hệ thống, tôi cần đánh giá sai số dự báo theo thời gian để cải thiện mô hình. | Có báo cáo MAPE theo thời gian, cảnh báo khi sai số vượt ngưỡng. | **Nâng cao** |

# **7\. Yêu cầu phi chức năng**

* **Bảo mật:** phân quyền truy cập theo vai trò (RBAC); mã hoá dữ liệu bán hàng nhạy cảm; không để lộ dữ liệu khách hàng ra ngoài phạm vi nội bộ.

* **Tần suất cập nhật:** cập nhật dữ liệu tối thiểu theo lô hàng ngày (daily batch); mục tiêu dài hạn là near real-time.

* **Kiểm soát chi phí:** giới hạn tần suất gọi mô hình / LLM tính toán lại (ví dụ không tính lại quá 1 lần/ngày/phân khu trừ khi có dữ liệu mới); theo dõi chi phí API và compute định kỳ.

* **Độ tin cậy:** toàn bộ dự báo phải đi kèm khoảng tin cậy và giả định rõ ràng (dữ liệu đầu vào, khung thời gian dự báo).

* **Khả năng mở rộng:** kiến trúc cho phép mở rộng sang nhiều dự án / phân khu khác nhau.

* **Khả năng kiểm toán:** lưu lại lịch sử các dự báo, đề xuất và quyết định duyệt / từ chối của quản lý kinh doanh.

# **8\. Kiến trúc giải pháp & công nghệ đề xuất**

Luồng xử lý tổng quát: dữ liệu bán hàng / tồn kho → tầng dữ liệu → Agent phân tích → mô hình dự báo \+ LLM diễn giải → dashboard → quản lý kinh doanh duyệt (HITL) → hành động chính sách.

| Tầng dữ liệu | DuckDB / PostgreSQL — lưu trữ dữ liệu bán hàng, tồn kho theo thời gian. |
| :---- | :---- |
| **Tầng dự báo** | Mô hình chuỗi thời gian đơn giản / Prophet (Python), kết hợp LLM diễn giải kết quả bằng ngôn ngữ tự nhiên. |
| **Tầng điều phối Agent** | LangGraph — điều phối luồng phân tích, dự báo, giải thích và đề xuất hành động. |
| **Tầng API** | FastAPI — cung cấp API cho dashboard và các dịch vụ nội bộ. |
| **Tầng giao diện** | Next.js — dashboard biểu đồ trực quan cho nhân viên kinh doanh và quản lý. |
| **Triển khai** | [Fly.io](http://Fly.io). Railway, Render |

# **9\. Ràng buộc**

* **HITL bắt buộc:** mọi quyết định chính sách bán hàng dựa trên dự báo phải được quản lý kinh doanh phê duyệt trước khi áp dụng; Agent không được tự động thực thi thay đổi giá / chính sách.

* **Minh bạch dự báo:** mỗi dự báo phải kèm khoảng tin cậy và giả định rõ ràng, tránh gây hiểu lầm đây là số liệu chắc chắn.

* **Bảo mật dữ liệu:** dữ liệu bán hàng là thông tin nhạy cảm, cần tuân thủ chính sách bảo mật nội bộ và phân quyền truy cập chặt chẽ.

* **Kiểm soát chi phí:** tần suất tính toán lại mô hình / gọi LLM cần được giới hạn để kiểm soát chi phí vận hành định kỳ.

# **10\. Rủi ro & phương án giảm thiểu**

| Rủi ro | Ảnh hưởng | Phương án giảm thiểu |
| :---- | :---- | :---- |
| Dữ liệu lịch sử không đầy đủ / chất lượng thấp trong giai đoạn đầu. | Dự báo kém chính xác. | Hiển thị rõ mức độ tin cậy thấp; yêu cầu duyệt kỹ hơn khi thiếu dữ liệu; validate dữ liệu đầu vào. |
| Người dùng phụ thuộc quá mức vào AI, bỏ qua đánh giá thực tế. | Quyết định chính sách sai lệch. | Duy trì cơ chế HITL bắt buộc; đào tạo người dùng hiểu rõ giới hạn của mô hình. |
| Chi phí tính toán / gọi API tăng khi mở rộng số phân khu, dự án. | Vượt ngân sách vận hành. | Giới hạn tần suất tính toán lại; theo dõi và cảnh báo chi phí định kỳ. |
| Thay đổi mô hình dự báo ở Giai đoạn 2 gây sai lệch tạm thời so với mô hình cũ. | Giảm niềm tin của người dùng. | Chạy song song (A/B) và so sánh MAPE trước khi thay thế mô hình chính thức. |

# **11\. Chỉ số thành công (Success Metrics / KPIs)**

* **Độ chính xác dự báo:** MAPE trung bình theo phân khu / loại căn, cải thiện dần qua các đợt đánh giá.

* **Thời gian ra quyết định:** thời gian trung bình từ khi phát hiện bất thường tồn kho đến khi chính sách được duyệt và áp dụng.

* **Tỷ lệ cảnh báo chính xác:** phần trăm cảnh báo cạn hàng được xác nhận đúng trên thực tế.

* **Mức độ sử dụng:** số lượt truy cập dashboard mỗi tuần của nhân viên kinh doanh và quản lý.

* **Mức độ hài lòng người dùng:** khảo sát định kỳ với Ban kinh doanh.

# **12\. Kế hoạch triển khai đề xuất**

| Giai đoạn  | Nội dung chính |
| :---- | :---- |
| **Tuần 1** | Tập trung xác định Problem Statement, nghiên cứu painpoint, xác định rõ Scope và Input/Output, xây dựng luồng workflow dự án. |
| **Tuần 2** | Thu thập, làm sạch dữ liệu bán hàng / tồn kho; thiết kế schema dữ liệu (DuckDB/Postgres); thiết kế kiến trúc tổng thể. |
| **Tuần 3** | Xây dựng mô hình dự báo cơ bản (Prophet); xây dựng LangGraph agent phân tích; xây dựng API (FastAPI). |
| **Tuần 4** | Xây dựng dashboard Next.js; tích hợp luồng phê duyệt HITL; tích hợp LLM diễn giải kết quả. |
| **Tuần 5** | Kiểm thử, tối ưu mô hình và triển khai ([Fly.io](http://Fly.io), Railway, Render) |
| **Tuần 6** | Demo và thu thập phản hồi |

# **13\. Các bên liên quan**

| Product Owner (học viên) | Định nghĩa yêu cầu, phạm vi, ưu tiên tính năng; chịu trách nhiệm chung về sản phẩm. |
| :---- | :---- |
| **Ban Kinh doanh (Sales)** | Người dùng chính; cung cấp dữ liệu nghiệp vụ và phản hồi trong quá trình phát triển. |
| **Đội kỹ thuật (Data/AI, Backend, Frontend)** | Xây dựng, kiểm thử và triển khai hệ thống. |
| **Giảng viên / Mentor chương trình VinUni × Vingroup** | Đánh giá tiến độ, góp ý chuyên môn và định hướng sản phẩm. |

# **14\. Quy mô thị trường (Market)**

Theo số liệu quý I/2026 của Bộ Xây dựng và Hội Môi giới Bất động sản Việt Nam (VARS), cả nước hiện có hơn 1.360 dự án nhà ở đang triển khai với quy mô khoảng 654.000 căn, tổng lượng giao dịch quý I/2026 đạt gần 140.000 căn; nguồn cung nhà ở mới cho cả năm 2026 được ước tính khoảng 150.000 sản phẩm trên toàn quốc. Đây là quy mô thị trường tiềm năng (TAM) cho một giải pháp số hoá quản lý và dự báo tốc độ bán hàng theo phân khu / loại căn.

* **Thị trường mục tiêu (SAM):** nhóm chủ đầu tư sở hữu nhiều dự án / phân khu quy mô lớn — nơi bài toán theo dõi tốc độ hấp thụ theo hàng trăm loại căn trở nên phức tạp và có giá trị cao nhất. Theo báo cáo năm 2025 của Hội Môi giới Bất động sản Việt Nam, 4 nhà phát triển lớn nhất thị trường (Vingroup, Masterise Homes, MIK, Sun Group) chiếm tới 64% tổng nguồn cung, và nguồn cung 2026 được dự báo tiếp tục tăng hơn 40%, chủ yếu đến từ nhóm này — đây chính là nhóm khách hàng có nhiều phân khu / dự án mở bán song song, phù hợp nhất với AI Agent.

* **Thị trường khả thi ban đầu (SOM):** trong phạm vi chương trình đào tạo, phạm vi triển khai ban đầu (pilot) giới hạn ở 1 dự án cụ thể với 2–3 phân khu / loại căn đại diện, trước khi cân nhắc nhân rộng sang các dự án và chủ đầu tư khác.

* **Xu hướng hỗ trợ:** thị trường đang bước vào giai đoạn sàng lọc và tái cấu trúc, nguồn lực tập trung vào các chủ đầu tư có năng lực tài chính và vận hành mạnh — đây là nhóm sẵn sàng đầu tư vào công cụ số hoá để tối ưu tốc độ bán hàng và dòng tiền.

*Lưu ý: số liệu trên mang tính tham khảo ở cấp độ toàn thị trường, dùng để minh hoạ quy mô cơ hội; phạm vi triển khai thực tế của đề tài trong khuôn khổ chương trình đào tạo sẽ giới hạn ở SOM nêu trên.*

# **15\. Kế hoạch xác thực ban đầu (Traction)**

Vì đây là đề tài xây dựng mới trong khuôn khổ chương trình đào tạo, sản phẩm chưa có traction thực tế. Brief đề xuất một kế hoạch xác thực (validate) sớm nhằm tạo bằng chứng ban đầu trước khi cân nhắc nhân rộng:

* **Pilot phạm vi nhỏ:** triển khai thử nghiệm trên 1 dự án với 2–3 phân khu / loại căn đại diện (ví dụ: 1 phân khu bán chạy, 1 phân khu bán chậm) để kiểm chứng mô hình dự báo trên dữ liệu thực tế.

* **Người dùng thử nghiệm:** thu thập phản hồi định kỳ hằng tuần từ 3–5 nhân viên kinh doanh và 1 quản lý kinh doanh, trực tiếp sử dụng dashboard trong 4 tuần triển khai MVP.

* **Mốc thành công ban đầu:** mô hình dự báo đạt sai số (MAPE) ở mức chấp nhận được trên dữ liệu pilot; có ít nhất 1 đề xuất hành động từ Agent được quản lý kinh doanh phê duyệt và áp dụng thực tế; đa số người dùng thử nghiệm đánh giá dashboard hữu ích hơn báo cáo Excel hiện tại qua khảo sát nhanh.

* **Mở rộng sau pilot:** nếu đạt các mốc trên, mở rộng dần sang toàn bộ phân khu của dự án, sau đó xem xét nhân rộng sang các dự án khác trong danh mục chủ đầu tư.

# **16\. Đề xuất hỗ trợ tiếp theo (Ask)**

Để đưa brief này từ ý tưởng sang triển khai thực tế, học viên / nhóm đề xuất một số hỗ trợ cụ thể sau:

* **Dữ liệu:** quyền truy cập dữ liệu bán hàng & tồn kho lịch sử (đã ẩn danh hoá phần nhạy cảm) của ít nhất 1 dự án thực tế, để huấn luyện và kiểm chứng mô hình dự báo.

* **Đầu mối nghiệp vụ:** 1 quản lý kinh doanh tham gia làm đầu mối duyệt dự báo, góp ý tiêu chí cảnh báo cạn hàng và xác nhận tính hợp lý của các đề xuất hành động.

* **Cố vấn kỹ thuật:** hỗ trợ từ giảng viên / mentor chương trình về lựa chọn mô hình dự báo phù hợp và thiết kế kiến trúc LangGraph agent.

* **Hạ tầng tính toán:** ngân sách / tài khoản thử nghiệm cho compute và gọi API LLM trong giai đoạn pilot, ở mức chi phí thử nghiệm nhỏ.

* **Thời gian:** 4 tuần để hoàn thành MVP theo kế hoạch ở Mục 12, cộng thêm 1–2 tuần pilot thu thập phản hồi trước khi báo cáo kết quả cuối khoá.

# **17\. Giả định**

* Có sẵn dữ liệu lịch sử bán hàng và tồn kho tối thiểu vài tháng gần nhất để huấn luyện mô hình dự báo ban đầu.

* Dữ liệu có thể được cung cấp qua file Excel/CSV định kỳ, hoặc kết nối API với hệ thống CRM/ERP hiện có.

* Có ít nhất một quản lý kinh doanh tham gia làm đầu mối phê duyệt (HITL) trong giai đoạn thử nghiệm.

# **18\. Ngoài phạm vi**

* Agent không tự động thực thi thay đổi giá bán / chính sách chiết khấu mà không qua phê duyệt của con người.

* Không xử lý các giao dịch tài chính, thanh toán hay ký kết hợp đồng.

* Không thay thế hoàn toàn vai trò tư vấn bán hàng của nhân viên kinh doanh.