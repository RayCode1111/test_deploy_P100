# Product Requirements Document

**Tên sản phẩm:** AbsorptionForecast AI Agent — Trợ lý dự báo tồn kho & tốc độ hấp thụ căn hộ
**Loại sản phẩm:** AI Agent phân tích dữ liệu & dự báo chuỗi thời gian, có giải thích (explainable) và đề xuất hành động
**Lĩnh vực:** Bất động sản — Kinh doanh & quản lý bán hàng dự án căn hộ
**Phiên bản:** MVP 1.0 (5 tuần)
**Ngày cập nhật:** 29/07/2026
**Product Owner:** Nguyễn Đức Đạt, Bùi Hoàng Vương, Nguyễn Trọng Nam, Đặng Tiến Thành
**Người phê duyệt nghiệp vụ (HITL):** Quản lý kinh doanh (Sales Manager)

---

## 1. Bối cảnh

Trong các dự án chung cư / khu đô thị quy mô lớn, sản phẩm được chia thành nhiều phân khu và loại căn (diện tích, hướng, tầng, số phòng ngủ). Tốc độ hấp thụ giữa các nhóm rất không đồng đều: có loại "cháy hàng", có loại tồn kho kéo dài.

Ban kinh doanh cần liên tục biết:

- Phân khu / loại căn nào **sắp hết hàng** → cân nhắc tăng giá, siết ưu đãi.
- Phân khu / loại căn nào **bán chậm** → tập trung nguồn lực sale, đẩy chính sách kích cầu.

Hiện việc theo dõi dựa chủ yếu vào kinh nghiệm của quản lý kinh doanh cộng với báo cáo Excel tổng hợp thủ công — cập nhật chậm, thiếu hệ thống.

---

## 2. Vấn đề

Doanh nghiệp thiếu năng lực ra quyết định dựa trên trạng thái cập nhật của giỏ hàng và tốc độ hấp thụ theo từng phân khu / loại căn. Khi không biết chính xác căn nào sắp hết, căn nào bán chậm, ban kinh doanh khó điều chỉnh giá, chiết khấu và phân bổ nguồn lực sale đúng thời điểm.

**Tác động nếu không giải quyết**

| Hệ quả | Mô tả |
| --- | --- |
| Chậm ra quyết định | Chính sách giá / chiết khấu điều chỉnh trễ, thiếu cơ sở định lượng |
| Bỏ lỡ thời điểm tối ưu | Chậm tăng giá khi cầu cao, chậm kích cầu khi hàng tồn lâu |
| Lãng phí nguồn lực sale | Phân bổ nhân sự tư vấn không dựa trên dữ liệu tốc độ bán thực tế |

---

## 3. Mục tiêu

### 3.1 Mục tiêu sản phẩm (MVP)

| ID | Mục tiêu | Chỉ tiêu (SMART) trong phạm vi MVP |
| --- | --- | --- |
| O1 | Rút ngắn thời gian phát hiện biến động tốc độ hấp thụ | Dashboard cập nhật tối thiểu 1 lần/ngày; độ trễ từ khi có dữ liệu bán hàng đến khi hệ thống cảnh báo < 24 giờ |
| O2 | Nhắm đúng đối tượng cần chính sách kích cầu | Agent xếp nhóm phân khu / loại căn theo mức rủi ro tồn kho dựa trên tốc độ hấp thụ dự báo; giảm số phân khu phải nhận mức chiết khấu tối đa so với cách áp dụng đại trà |
| O3 | Cải thiện tỷ lệ hấp thụ ở phân khu được theo dõi | So sánh tỷ lệ hấp thụ giữa nhóm có áp dụng đề xuất của Agent và nhóm không áp dụng trong pilot (baseline ngành ~70%, DXS-FERI 6T/2026) |
| O4 | Nâng độ chính xác dự báo so với ước tính cảm tính | MAPE được đo và công bố sau mỗi chu kỳ đánh giá; 100% dự báo hiển thị kèm khoảng tin cậy |
| O5 | Đảm bảo kiểm soát của con người | 100% đề xuất chính sách được quản lý kinh doanh duyệt trước khi áp dụng; 0 trường hợp tự động thực thi, kiểm chứng qua log |

### 3.2 Ngoài mục tiêu (Non-goals)

- Agent **không** tự động thực thi thay đổi giá bán / chính sách chiết khấu.
- Không xử lý giao dịch tài chính, thanh toán, ký kết hợp đồng.
- Không thay thế vai trò tư vấn của nhân viên kinh doanh.

---

## 4. Người dùng (Personas)

| Persona | Bối cảnh | Nhu cầu cốt lõi |
| --- | --- | --- |
| **Nhân viên kinh doanh (Sales Staff)** | Phụ trách một số phân khu / loại căn | Xem tốc độ hấp thụ nhóm mình phụ trách; nhận cảnh báo khi loại căn sắp cạn hàng để chủ động tư vấn |
| **Quản lý kinh doanh (Sales Manager)** | Chịu trách nhiệm chính sách giá / chiết khấu toàn dự án | Xem báo cáo tổng hợp, hiểu lý do dự báo, duyệt / từ chối đề xuất trước khi áp dụng (HITL) |
| **Ban điều hành / Lãnh đạo dự án** | Ra quyết định chiến lược | Xem báo cáo tổng quan định kỳ về tồn kho và tốc độ bán |

*Ghi chú:* trong MVP, Ban điều hành dùng chung dashboard tổng hợp với Sales Manager (chỉ quyền xem), không xây màn hình riêng.

---

## 5. Phạm vi MVP (5 tuần)

### 5.1 Trong phạm vi

1. **Nạp dữ liệu:** import file Excel/CSV bán hàng & tồn kho theo lô hằng ngày; validate dữ liệu đầu vào (thiếu trường, sai định dạng, trùng bản ghi).
2. **Tính tốc độ hấp thụ:** theo phân khu / loại căn, hiển thị biểu đồ xu hướng theo thời gian.
3. **Dự báo:** mô hình chuỗi thời gian Prophet dự báo tốc độ bán và **ngày dự kiến hết hàng**, kèm khoảng tin cậy 90%.
4. **Cảnh báo cạn hàng:** cảnh báo trong ứng dụng khi tồn kho dự kiến xuống dưới ngưỡng ngày do quản lý cấu hình.
5. **Giải thích bằng ngôn ngữ tự nhiên:** LLM sinh đoạn giải thích các yếu tố chính ảnh hưởng tốc độ bán cho mỗi dự báo.
6. **Đề xuất hành động cơ bản:** Agent gợi ý nhóm phân khu nên siết ưu đãi / nên kích cầu, kèm mức rủi ro tồn kho.
7. **Luồng HITL:** quản lý kinh doanh xem, duyệt hoặc từ chối dự báo / đề xuất; chỉ đề xuất đã duyệt mới được đánh dấu hiệu lực.
8. **Phân quyền & audit log:** RBAC 2 vai trò (Sales Staff, Sales Manager) + vai trò chỉ-xem; lưu lịch sử dự báo, đề xuất và quyết định duyệt / từ chối.

### 5.2 Ngoài phạm vi MVP (cân nhắc sau pilot)

- Tự động so sánh & lựa chọn nhiều mô hình dự báo (ARIMA, ML khác).
- Mô phỏng what-if tác động thay đổi giá / chính sách.
- Cảnh báo đa kênh (email, Zalo, Slack).
- Theo dõi MAPE tự động theo thời gian và tự đề xuất huấn luyện lại mô hình.
- Kết nối trực tiếp CRM/ERP theo API (MVP dùng import file).
- Near real-time (MVP dùng daily batch).

---

## 6. User Stories & Yêu cầu chức năng

Tất cả yêu cầu dưới đây thuộc phạm vi MVP.

| ID | User Story | Tiêu chí chấp nhận |
| --- | --- | --- |
| **FR-01** | Là nhân viên kinh doanh, tôi muốn xem tốc độ hấp thụ của phân khu / loại căn mình phụ trách để biết căn nào cần tư vấn gấp. | Dashboard hiển thị tốc độ hấp thụ theo phân khu / loại căn dưới dạng biểu đồ xu hướng; dữ liệu cập nhật ít nhất 1 lần/ngày; hiển thị mốc thời gian cập nhật gần nhất. |
| **FR-02** | Là nhân viên kinh doanh, tôi muốn nhận cảnh báo khi một loại căn sắp hết hàng để chủ động tư vấn khách. | Hệ thống hiển thị cảnh báo trong app khi số ngày tồn kho dự kiến < ngưỡng cấu hình; cảnh báo nêu rõ phân khu / loại căn, ngày dự kiến hết hàng và mức tin cậy. |
| **FR-03** | Là quản lý kinh doanh, tôi muốn xem giải thích các yếu tố ảnh hưởng đến tốc độ bán để hiểu nguyên nhân. | Mỗi dự báo kèm đoạn giải thích bằng tiếng Việt do LLM sinh, liệt kê các yếu tố chính (xu hướng, mùa vụ, thay đổi tồn kho) và giả định đã dùng. |
| **FR-04** | Là quản lý kinh doanh, tôi muốn duyệt hoặc từ chối đề xuất chính sách trước khi áp dụng. | Đề xuất ở trạng thái *Chờ duyệt* mặc định; chỉ chuyển sang *Đã duyệt* khi quản lý xác nhận; mọi hành động duyệt / từ chối kèm người thực hiện, thời điểm và lý do được ghi log. |
| **FR-05** | Là quản lý kinh doanh, tôi muốn xem khoảng tin cậy của mỗi dự báo để đánh giá độ rủi ro. | Mỗi số liệu dự báo hiển thị kèm khoảng tin cậy 90% (cận trên / cận dưới); dự báo dựa trên dữ liệu mỏng được gắn nhãn "độ tin cậy thấp". |
| **FR-06** | Là quản lý kinh doanh, tôi muốn nạp dữ liệu bán hàng & tồn kho định kỳ để hệ thống luôn phản ánh giỏ hàng hiện tại. | Import Excel/CSV theo template quy định; hệ thống báo lỗi rõ ràng theo dòng khi dữ liệu không hợp lệ; import thành công kích hoạt tính lại dự báo. |
| **FR-07** | Là quản lý kinh doanh, tôi muốn xem danh sách phân khu xếp theo mức rủi ro tồn kho để ưu tiên hành động. | Danh sách phân khu / loại căn xếp hạng theo rủi ro tồn kho (dựa trên tốc độ hấp thụ dự báo & tồn kho hiện tại), kèm đề xuất hướng hành động (siết ưu đãi / kích cầu). |
| **FR-08** | Là hệ thống, tôi cần lưu lịch sử dự báo và quyết định để phục vụ kiểm toán và đo MAPE. | Mọi dự báo, đề xuất và quyết định HITL được lưu kèm timestamp, phiên bản dữ liệu đầu vào; có màn hình/API tra cứu lịch sử. |

---

## 7. Yêu cầu phi chức năng

| Nhóm | Yêu cầu |
| --- | --- |
| **Bảo mật** | RBAC theo vai trò; dữ liệu bán hàng nhạy cảm không rời phạm vi nội bộ; dữ liệu khách hàng được ẩn danh trước khi đưa vào hệ thống |
| **Tần suất cập nhật** | Daily batch: dữ liệu và dự báo cập nhật tối thiểu 1 lần/ngày |
| **Hiệu năng** | Dashboard tải trong < 3 giây với quy mô pilot (1 dự án, ≤ 3 phân khu); job dự báo hằng ngày hoàn tất < 15 phút |
| **Kiểm soát chi phí** | Không tính lại mô hình / gọi LLM quá 1 lần/ngày/phân khu trừ khi có dữ liệu mới; ghi nhận số lần gọi LLM để theo dõi chi phí |
| **Độ tin cậy** | 100% dự báo đi kèm khoảng tin cậy và giả định rõ ràng (nguồn dữ liệu, khung thời gian) |
| **Khả năng mở rộng** | Schema dữ liệu và API thiết kế theo `project_id` / `phân khu` để mở rộng sang dự án khác mà không đổi cấu trúc |
| **Khả năng kiểm toán** | Lưu toàn bộ lịch sử dự báo, đề xuất và quyết định duyệt / từ chối, truy vấn được |

---

## 8. Kiến trúc & công nghệ

**Luồng xử lý:** dữ liệu bán hàng / tồn kho → tầng dữ liệu → Agent phân tích → mô hình dự báo + LLM diễn giải → dashboard → quản lý kinh doanh duyệt (HITL) → hành động chính sách.

| Tầng | Công nghệ | Vai trò |
| --- | --- | --- |
| Dữ liệu | DuckDB / PostgreSQL | Lưu dữ liệu bán hàng, tồn kho theo thời gian; lưu lịch sử dự báo & audit log |
| Dự báo | Prophet (Python) | Dự báo tốc độ bán & ngày dự kiến hết hàng kèm khoảng tin cậy |
| Điều phối Agent | LangGraph | Điều phối luồng: phân tích → dự báo → giải thích → đề xuất hành động |
| Diễn giải | LLM | Sinh giải thích ngôn ngữ tự nhiên cho mỗi dự báo |
| API | FastAPI | Cung cấp API cho dashboard và dịch vụ nội bộ |
| Giao diện | Next.js | Dashboard biểu đồ cho nhân viên và quản lý kinh doanh |
| Triển khai | Fly.io (thay thế: Railway, Render) | Môi trường pilot |

---

## 9. Ràng buộc

- **HITL bắt buộc:** mọi quyết định chính sách bán hàng dựa trên dự báo phải được quản lý kinh doanh phê duyệt trước khi áp dụng; Agent không tự động thực thi thay đổi giá / chính sách.
- **Minh bạch dự báo:** mỗi dự báo phải kèm khoảng tin cậy và giả định rõ ràng, tránh hiểu lầm là số liệu chắc chắn.
- **Bảo mật dữ liệu:** dữ liệu bán hàng là thông tin nhạy cảm, tuân thủ chính sách bảo mật nội bộ và phân quyền chặt chẽ.
- **Kiểm soát chi phí:** giới hạn tần suất tính lại mô hình / gọi LLM.
- **Thời gian:** MVP hoàn thành trong 5 tuần, sau đó 1–2 tuần pilot thu thập phản hồi.

---

## 10. Giả định

Từ brief:

- Có sẵn dữ liệu lịch sử bán hàng và tồn kho tối thiểu vài tháng gần nhất để huấn luyện mô hình.
- Dữ liệu được cung cấp qua file Excel/CSV định kỳ (kết nối CRM/ERP nằm ngoài MVP).
- Có ít nhất một quản lý kinh doanh tham gia làm đầu mối phê duyệt (HITL) trong giai đoạn thử nghiệm.

Giả định bổ sung của PRD (cần xác nhận trong Tuần 1):

- Phạm vi pilot: **1 dự án, 2–3 phân khu / loại căn đại diện** (ít nhất 1 bán chạy, 1 bán chậm).
- Đơn vị dữ liệu tối thiểu: số căn bán được theo ngày, theo phân khu / loại căn.
- Ngưỡng cảnh báo cạn hàng mặc định: **30 ngày tồn kho dự kiến**, cho phép quản lý điều chỉnh.
- Khoảng tin cậy hiển thị mặc định: **90%**.
- Số lượng người dùng pilot: 3–5 nhân viên kinh doanh + 1 quản lý kinh doanh.

---

## 11. Chỉ số thành công (KPIs)

| KPI | Định nghĩa | Mục tiêu pilot |
| --- | --- | --- |
| Độ chính xác dự báo | MAPE trung bình theo phân khu / loại căn | Đo được và công bố sau mỗi chu kỳ đánh giá; cải thiện qua các lần huấn luyện lại |
| Độ trễ phát hiện | Thời gian từ khi phát sinh dữ liệu bán hàng đến khi hệ thống cảnh báo | < 24 giờ |
| Thời gian ra quyết định | Thời gian trung bình từ khi phát hiện bất thường đến khi chính sách được duyệt | Giảm so với quy trình Excel hiện tại (baseline xác định ở Tuần 1) |
| Tỷ lệ cảnh báo chính xác | % cảnh báo cạn hàng được xác nhận đúng trên thực tế | Theo dõi & báo cáo cuối pilot |
| Tỷ lệ tuân thủ HITL | % đề xuất được duyệt trước khi áp dụng | 100%; 0 trường hợp tự động thực thi |
| Mức độ sử dụng | Số lượt truy cập dashboard/tuần của nhân viên & quản lý | Theo dõi hằng tuần trong pilot |
| Mức độ hài lòng | Khảo sát nhanh cuối pilot | Đa số người dùng đánh giá hữu ích hơn báo cáo Excel hiện tại |

---

## 12. Tiêu chí chấp nhận MVP (Definition of Done)

MVP được coi là hoàn thành khi **tất cả** điều kiện sau đạt:

1. Import được file Excel/CSV thực tế của dự án pilot; dữ liệu sai được báo lỗi theo dòng, không làm hỏng dữ liệu đã có.
2. Dashboard hiển thị tốc độ hấp thụ theo phân khu / loại căn, cập nhật tự động ít nhất 1 lần/ngày.
3. Mỗi phân khu / loại căn có dự báo ngày dự kiến hết hàng kèm khoảng tin cậy 90%.
4. Cảnh báo cạn hàng hiển thị đúng khi tồn kho dự kiến dưới ngưỡng cấu hình.
5. Mỗi dự báo có đoạn giải thích tiếng Việt do LLM sinh, nêu yếu tố chính và giả định.
6. Danh sách phân khu xếp hạng theo rủi ro tồn kho kèm hướng hành động đề xuất.
7. Luồng HITL hoạt động đầy đủ: đề xuất chỉ có hiệu lực sau khi quản lý duyệt; log ghi đủ người duyệt, thời điểm, kết quả.
8. RBAC hoạt động: nhân viên chỉ thấy phân khu phụ trách; quản lý thấy toàn dự án và có quyền duyệt.
9. MAPE của mô hình được tính trên tập kiểm chứng của dữ liệu pilot và ghi nhận trong báo cáo.
10. Hệ thống được triển khai trên môi trường pilot (Fly.io) và chạy được job dự báo hằng ngày.

---

## 13. Kế hoạch triển khai (5 tuần)

| Tuần | Nội dung chính | Đầu ra |
| --- | --- | --- |
| **Tuần 1** | Xác nhận problem statement & pain point với ban kinh doanh; chốt scope, input/output, ngưỡng cảnh báo; thiết kế workflow | Bản chốt scope + template dữ liệu Excel/CSV |
| **Tuần 2** | Thu thập & làm sạch dữ liệu bán hàng / tồn kho; thiết kế schema (DuckDB/Postgres); thiết kế kiến trúc tổng thể | Schema dữ liệu + pipeline import chạy được |
| **Tuần 3** | Xây mô hình dự báo Prophet; LangGraph agent phân tích & đề xuất; API FastAPI | API trả dự báo + khoảng tin cậy + đề xuất |
| **Tuần 4** | Dashboard Next.js; tích hợp cảnh báo, luồng HITL, RBAC, audit log; tích hợp LLM diễn giải | MVP tích hợp đầy đủ theo Mục 12 |
| **Tuần 5** | Kiểm thử, đo MAPE, tối ưu mô hình, triển khai Fly.io, demo & thu thập phản hồi | MVP triển khai + báo cáo MAPE + demo |

*Pilot 1–2 tuần sau Tuần 5: vận hành thực tế với dự án pilot, thu phản hồi hằng tuần, tổng kết KPI.*

---

## 14. Rủi ro & phương án giảm thiểu

| Rủi ro | Ảnh hưởng | Giảm thiểu |
| --- | --- | --- |
| Dữ liệu lịch sử không đầy đủ / chất lượng thấp | Dự báo kém chính xác | Validate dữ liệu đầu vào; gắn nhãn "độ tin cậy thấp"; yêu cầu duyệt kỹ hơn khi thiếu dữ liệu |
| Người dùng phụ thuộc quá mức vào AI | Quyết định chính sách sai lệch | Duy trì HITL bắt buộc; hướng dẫn người dùng hiểu giới hạn mô hình |
| Chi phí compute / LLM tăng khi mở rộng | Vượt ngân sách vận hành | Giới hạn tần suất tính lại; ghi nhận và theo dõi số lần gọi LLM |
| Không kịp truy cập dữ liệu thực tế trong Tuần 2 | Trễ toàn bộ tiến độ | Chuẩn bị bộ dữ liệu mẫu tương đương để phát triển song song, thay bằng dữ liệu thật khi có |

---

## 15. Các bên liên quan

| Bên liên quan | Vai trò |
| --- | --- |
| Product Owner (học viên) | Định nghĩa yêu cầu, phạm vi, ưu tiên tính năng |
| Ban Kinh doanh (Sales) | Người dùng chính; cung cấp dữ liệu nghiệp vụ và phản hồi |
| Đội kỹ thuật (Data/AI, Backend, Frontend) | Xây dựng, kiểm thử và triển khai hệ thống |
| Giảng viên / Mentor VinUni × Vingroup | Đánh giá tiến độ, góp ý chuyên môn |

---

## 16. Đề xuất hỗ trợ (Ask)

- **Dữ liệu:** quyền truy cập dữ liệu bán hàng & tồn kho lịch sử (đã ẩn danh) của ít nhất 1 dự án thực tế.
- **Đầu mối nghiệp vụ:** 1 quản lý kinh doanh làm đầu mối duyệt dự báo và xác nhận tiêu chí cảnh báo.
- **Cố vấn kỹ thuật:** hỗ trợ về lựa chọn mô hình dự báo và thiết kế kiến trúc LangGraph agent.
- **Hạ tầng:** ngân sách thử nghiệm cho compute và gọi API LLM ở mức nhỏ.
- **Thời gian:** 5 tuần MVP + 1–2 tuần pilot trước khi báo cáo kết quả cuối khoá.

---

## 17. Phụ lục — Định nghĩa

| Thuật ngữ | Ý nghĩa |
| --- | --- |
| Tốc độ hấp thụ | Số căn bán được trên một đơn vị thời gian của một phân khu / loại căn |
| Tỷ lệ hấp thụ (absorption rate) | % sản phẩm đã bán trên tổng sản phẩm mở bán |
| Phân khu / loại căn | Đơn vị phân tích: nhóm căn hộ theo phân khu, diện tích, số phòng ngủ, hướng, tầng |
| Ngày dự kiến hết hàng | Ngày tồn kho của một phân khu / loại căn được dự báo về 0 theo tốc độ hấp thụ hiện tại |
| MAPE | Sai số phần trăm tuyệt đối trung bình — thước đo độ chính xác dự báo |
| HITL | Human-in-the-loop — cơ chế bắt buộc người duyệt trước khi áp dụng đề xuất |
