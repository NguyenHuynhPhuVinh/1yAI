var Languages = {};
(function () {
	Languages.vi = {
		"values": [{
			"value": "Invitation",
			"comment": "heading",
			"translation": "Lời mời"
		}, {
			"value": "Hi, I'm Gordon Hench the host of the local hobby computer club. I just discovered that your company is close-by. I'm a huge fan of {0} and would love for you to join our meetup this week!\nEagerly awaiting your reply.\nGordon",
			"translation": "Chào bạn, tôi là Gordon Hench, chủ nhiệm câu lạc bộ máy tính nghiệp dư địa phương. Tôi vừa phát hiện ra công ty của bạn ở gần đây. Tôi là một người hâm mộ cuồng nhiệt của {0} và rất mong bạn tham gia buổi gặp mặt của chúng tôi vào tuần này!\nRất mong nhận được hồi âm của bạn.\nGordon"
		}, {
			"value": "Sure",
			"comment": "decision action button",
			"translation": "Chắc chắn rồi"
		}, {
			"value": "No time",
			"comment": "decision action button",
			"translation": "Không có thời gian"
		}, {
			"value": "Thank you very much! I'm sure our members will love what you have to say.\nGordon",
			"translation": "Cảm ơn bạn rất nhiều! Tôi chắc chắn các thành viên của chúng tôi sẽ rất thích những gì bạn chia sẻ.\nGordon"
		}, {
			"value": "Computer Club",
			"comment": "heading",
			"translation": "Câu lạc bộ Máy tính"
		}, {
			"value": "Hi I'm Frank More. We met at the Hobby Computer Club a week ago. Just wanted to say thanks for talking about your projects. I love your games and have told all my friends about them.",
			"translation": "Chào bạn, tôi là Frank More. Chúng ta đã gặp nhau ở Câu lạc bộ Máy tính Nghiệp dư một tuần trước. Tôi chỉ muốn cảm ơn bạn đã chia sẻ về các dự án của mình. Tôi rất thích các trò chơi của bạn và đã kể cho tất cả bạn bè của tôi về chúng."
		}, {
			"value": "Sorry to hear that you are busy.\nGordon",
			"translation": "Rất tiếc khi biết bạn bận.\nGordon"
		}, {
			"value": "Local News",
			"comment": "heading",
			"translation": "Tin tức Địa phương"
		}, {
			"value": "Hi, I'm Caroline Richards from the local news. I've heard rumours that you are already working on your next game and would love to do an interview about this. Do you have some time?",
			"translation": "Chào bạn, tôi là Caroline Richards từ tòa soạn báo địa phương. Tôi nghe đồn rằng bạn đang phát triển trò chơi tiếp theo của mình và rất muốn phỏng vấn bạn về điều này. Bạn có chút thời gian không?"
		}, {
			"value": "Great!\n\n\n ... Thank you for your time.{n}The interview should be published soon.",
			"translation": "Tuyệt vời!\n\n\n ... Cảm ơn bạn đã dành thời gian.{n}Bài phỏng vấn sẽ sớm được xuất bản."
		}, {
			"value": "not done",
			"comment": "localNewsPaperFragment",
			"translation": "chưa thực hiện"
		}, {
			"value": "done",
			"comment": "localNewsPaperFragment",
			"translation": "đã thực hiện"
		}, {
			"value": "{0}, a local start-up, is trying to make it big in the gaming industry. The company has already published {1} games and is working hard on their next.{n}In an interview founder {2} said that the next game is going to be a {3}/{4} game, something the company has {5} before. It's great to see small local companies enter exciting new industries. All the best of luck to {0}.",
			"comment": "{0} is company name, {1} nr. of games, {2} player name, {3} topic name, {4} genre name, {5} either not done/done (localNewsPaperFragment)",
			"translation": "{0}, một công ty khởi nghiệp địa phương, đang cố gắng tạo dựng tên tuổi trong ngành công nghiệp game. Công ty đã phát hành {1} trò chơi và đang nỗ lực cho sản phẩm tiếp theo.{n}Trong một cuộc phỏng vấn, người sáng lập {2} cho biết trò chơi tiếp theo sẽ là một trò chơi {3}/{4}, một điều mà công ty {5} trước đây. Thật tuyệt vời khi thấy các công ty nhỏ ở địa phương tham gia vào các ngành công nghiệp mới thú vị. Chúc {0} mọi điều may mắn."
		}, {
			"value": "Sorry to bother you",
			"translation": "Xin lỗi đã làm phiền bạn"
		}, {
			"value": "Media Enquiry",
			"comment": "heading",
			"translation": "Yêu cầu từ Truyền thông"
		}, {
			"value": "Hi, I'm Steve O'Connell, a reporter for Planet GG.\nWe've heard a rumour that your company is developing a game for mature audiences.\nWould you be willing to give an interview about this?",
			"translation": "Chào bạn, tôi là Steve O'Connell, phóng viên của Planet GG.\nChúng tôi nghe đồn rằng công ty của bạn đang phát triển một trò chơi cho đối tượng người lớn.\nBạn có sẵn lòng cho một cuộc phỏng vấn về vấn đề này không?"
		}, {
			"value": "Give interview",
			"comment": "decision action button",
			"translation": "Trả lời phỏng vấn"
		}, {
			"value": "No comment",
			"comment": "decision action button",
			"translation": "Không bình luận"
		}, {
			"value": "Many industry experts say that sooner or later games with mature themes will become more common. We are curious to see how the market will react to these games.",
			"translation": "Nhiều chuyên gia trong ngành cho rằng sớm hay muộn thì các trò chơi có chủ đề người lớn cũng sẽ trở nên phổ biến hơn. Chúng tôi rất tò mò muốn biết thị trường sẽ phản ứng thế nào với những trò chơi này."
		}, {
			"value": "Industry News",
			"comment": "heading",
			"translation": "Tin tức Ngành"
		}, {
			"value": "Planet GG has recently published an interview with {0}. According to the interview the company is working on its first game targeted at mature players. {1}, owner and CEO of {0} said, 'We think that players are looking for more mature content in games and we are willing to take a risk to give it to them.'{n}",
			"comment": "{0} company name, {1} staff name",
			"translation": "Planet GG gần đây đã đăng một bài phỏng vấn với {0}. Theo bài phỏng vấn, công ty đang phát triển trò chơi đầu tiên nhắm đến đối tượng người chơi trưởng thành. {1}, chủ sở hữu và CEO của {0} cho biết, 'Chúng tôi nghĩ rằng người chơi đang tìm kiếm nhiều nội dung người lớn hơn trong game và chúng tôi sẵn sàng chấp nhận rủi ro để mang đến điều đó cho họ.'{n}"
		}, {
			"value": "Great!\n\n\n ... Thank you for your time.{n}We will publish the interview next week.",
			"translation": "Tuyệt vời!\n\n\n ... Cảm ơn bạn đã dành thời gian.{n}Chúng tôi sẽ đăng bài phỏng vấn vào tuần tới."
		}, {
			"value": "There have been rumours circulating in the industry that {0} might be working on a game for mature audiences.",
			"comment": "{0} company name",
			"translation": "Có tin đồn lan truyền trong ngành rằng {0} có thể đang phát triển một trò chơi cho đối tượng người lớn."
		}, {
			"value": "Okay. Thank you for your time.",
			"translation": "Được rồi. Cảm ơn bạn đã dành thời gian."
		}, {
			"value": "Skip Tutorials",
			"comment": "heading",
			"translation": "Bỏ qua Hướng dẫn"
		}, {
			"value": "Hello there! It seems that you have already played before. You can get right into development and skip the tutorial messages. Note that you can always review tutorial messages (even the ones you have skipped) in the Help menu while you play a game.",
			"translation": "Chào bạn! Có vẻ như bạn đã chơi trước đây. Bạn có thể bắt tay ngay vào phát triển và bỏ qua các thông báo hướng dẫn. Lưu ý rằng bạn luôn có thể xem lại các thông báo hướng dẫn (kể cả những thông báo bạn đã bỏ qua) trong menu Trợ giúp khi bạn chơi game."
		}, {
			"value": "Skip tutorial!",
			"comment": "decision action button",
			"translation": "Bỏ qua hướng dẫn!"
		}, {
			"value": "Don't skip",
			"comment": "decision action button",
			"translation": "Không bỏ qua"
		}, {
			"value": "You have amassed over {0} in cash!\nUsually I would suggest that you should grow your company by moving into a larger office but unfortunately there don't seem to be any larger offices available in the lite version.{n}You can still continue your game until year 4 to see how much cash you will end up with and how many fans you will gain.",
			"comment": "{0} cash amount",
			"translation": "Bạn đã tích lũy được hơn {0} tiền mặt!\nThông thường tôi sẽ đề nghị bạn phát triển công ty bằng cách chuyển đến một văn phòng lớn hơn nhưng không may là dường như không có văn phòng lớn nào trong phiên bản lite.{n}Bạn vẫn có thể tiếp tục trò chơi của mình cho đến năm thứ 4 để xem bạn sẽ kiếm được bao nhiêu tiền mặt và bao nhiêu người hâm mộ."
		}, {
			"value": "Congratulations! You have made quite a name for yourself and have saved up a lot of capital. If you want to grow the company further then moving into a new office is the next step. I've found the perfect office, situated in a technology park. Would you like to move your company to the next level?",
			"translation": "Chúc mừng! Bạn đã tạo dựng được tên tuổi cho mình và tiết kiệm được rất nhiều vốn. Nếu bạn muốn phát triển công ty hơn nữa thì việc chuyển đến một văn phòng mới là bước tiếp theo. Tôi đã tìm thấy một văn phòng hoàn hảo, nằm trong một khu công nghệ cao. Bạn có muốn đưa công ty của mình lên một tầm cao mới không?"
		}, {
			"value": "New Office?",
			"comment": "heading",
			"translation": "Văn phòng mới?"
		}, {
			"value": "Move (pay {0})",
			"comment": "decision action button; move as in move to new office",
			"translation": "Chuyển (trả {0})"
		}, {
			"value": "Not yet",
			"comment": "decision action button",
			"translation": "Chưa vội"
		}, {
			"value": "New Office",
			"translation": "Văn phòng mới"
		}, {
			"value": "Invest (pay {0})",
			"comment": "decision action button",
			"translation": "Đầu tư (trả {0})"
		}, {
			"value": "New equipment",
			"translation": "Thiết bị mới"
		}, {
			"value": "Boss, {0} has grown well under your management. I think it is time to move the company out of this technology park and into a building worthy of our success.{n}I've seen the perfect building for our new headquarters.\nIt's not cheap but will allow us to grow even further. The new office also has space for additional expansions.\nDo you want to move?",
			"comment": "{0} company name",
			"translation": "Sếp ơi, {0} đã phát triển rất tốt dưới sự quản lý của sếp. Tôi nghĩ đã đến lúc chuyển công ty ra khỏi khu công nghệ này và đến một tòa nhà xứng đáng với thành công của chúng ta.{n}Tôi đã thấy một tòa nhà hoàn hảo cho trụ sở mới của chúng ta.\nNó không rẻ nhưng sẽ cho phép chúng ta phát triển hơn nữa. Văn phòng mới cũng có không gian để mở rộng thêm.\nSếp có muốn chuyển không?"
		}, {
			"value": "New office",
			"translation": "Văn phòng mới"
		}, {
			"value": "Game Over",
			"comment": "heading",
			"translation": "Kết thúc Game"
		}, {
			"value": "This is the end of your journey.\n\nYou can either load a saved game, restart this level or start a new game.",
			"translation": "Đây là điểm dừng chân cuối cùng của bạn.\n\nBạn có thể tải một game đã lưu, khởi động lại màn này hoặc bắt đầu một game mới."
		}, {
			"value": "Restart level",
			"comment": "decision action button",
			"translation": "Khởi động lại màn"
		}, {
			"value": "Start over",
			"comment": "decision action button",
			"translation": "Bắt đầu lại"
		}, {
			"value": "We can open our own hardware lab now.",
			"translation": "Chúng ta có thể mở phòng thí nghiệm phần cứng riêng ngay bây giờ."
		}, {
			"value": "Let's do it! (pay {0})",
			"comment": "decision action button",
			"translation": "Làm thôi! (trả {0})"
		}, {
			"value": "Hardware lab",
			"translation": "Phòng thí nghiệm Phần cứng"
		}, {
			"value": "Our hardware lab is ready.",
			"translation": "Phòng thí nghiệm phần cứng của chúng ta đã sẵn sàng."
		}, {
			"value": "We can open our own research and development lab now.",
			"translation": "Chúng ta có thể mở phòng thí nghiệm nghiên cứu và phát triển (R&D) riêng ngay bây giờ."
		}, {
			"value": "R&D lab",
			"translation": "Phòng thí nghiệm R&D"
		}, {
			"value": "Our R&D  lab is ready.",
			"translation": "Phòng thí nghiệm R&D của chúng ta đã sẵn sàng."
		}, {
			"value": "Fire employee?",
			"comment": "heading",
			"translation": "Sa thải nhân viên?"
		}, {
			"value": "Are you sure you want to fire {0}?",
			"comment": "{0} staff name",
			"translation": "Bạn có chắc chắn muốn sa thải {0} không?"
		}, {
			"value": "Yes",
			"translation": "Có"
		}, {
			"value": "No",
			"translation": "Không"
		}, {
			"value": "Hi Boss! I have a knack for security and I think we could really do with some security upgrades in our office.\nI have done some research and I think with an investment of {0} we would be a lot safer than we are now.\nWhat do you say?",
			"comment": "{0} amount",
			"translation": "Chào Sếp! Tôi có chút năng khiếu về bảo mật và tôi nghĩ chúng ta thực sự cần nâng cấp một số hạng mục an ninh trong văn phòng của mình.\nTôi đã tìm hiểu và nghĩ rằng với khoản đầu tư {0}, chúng ta sẽ an toàn hơn rất nhiều so với hiện tại.\nSếp thấy sao?"
		}, {
			"value": "Yes (invest {0})",
			"comment": "decision action button",
			"translation": "Có (đầu tư {0})"
		}, {
			"value": "Thanks Boss!\nI will get right to it.",
			"translation": "Cảm ơn Sếp!\nTôi sẽ bắt tay vào việc ngay."
		}, {
			"value": "Okay, sorry that I bothered you.",
			"translation": "Được rồi, xin lỗi đã làm phiền Sếp."
		}, {
			"value": "Investment",
			"comment": "heading",
			"translation": "Đầu tư"
		}, {
			"value": "Dear esteemed sir/madame.\nI'm financial advisor to CEO at WOMOBA OIL LIMITED in Nigeria. I'm writing because I know of your high repute and trustworthiness. Our CEO has authorzied me to invest {0} in {1}.{n}We have deposited the amount at a safe bank and will transfer this money to you but the bank requires confirmation from you. If you wish to receive the funds you must transfer a one-time verification payment of {2}. I trust in you.",
			"comment": "Note: this is a scam msg in game. immitate scammers language such as odd choice of words,  typos etc. {0} investAmount, {1} company name, {2} payment amount",
			"translation": "Kính gửi quý ông/bà.\nTôi là cố vấn tài chính cho CEO tại CÔNG TY TNHH DẦU KHÍ WOMOBA ở Nigeria. Tôi viết thư này vì biết đến uy tín và sự đáng tin cậy của ngài. CEO của chúng tôi đã ủy quyền cho tôi đầu tư {0} vào {1}.{n}Chúng tôi đã gửi số tiền này vào một ngân hàng an toàn và sẽ chuyển tiền cho ngài nhưng ngân hàng yêu cầu xác nhận từ ngài. Nếu ngài muốn nhận tiền, ngài phải chuyển một khoản thanh toán xác minh một lần là {2}. Tôi tin tưởng ở ngài."
		}, {
			"value": "Pay ({0})",
			"comment": "decision action button",
			"translation": "Thanh toán ({0})"
		}, {
			"value": "Decline",
			"comment": "decision action button",
			"translation": "Từ chối"
		}, {
			"value": "Gullibility Tax",
			"comment": "name of expense when player falls into the scam trap.",
			"translation": "Thuế Cả Tin"
		}, {
			"value": "News",
			"comment": "heading",
			"translation": "Tin tức"
		}, {
			"value": "It appears that recently a few companies have fallen victim to Nigerian scammers.\nThe scammers often claimed to invest large sums of money into companies but required a sizable up-front payment to make the deal.{n}Those who were unwise enough to pay will not see their money again.\nPolice are investigating but seem helpless to stop these international scammers.",
			"translation": "Có vẻ như gần đây một vài công ty đã trở thành nạn nhân của những kẻ lừa đảo Nigeria.\nNhững kẻ lừa đảo thường tuyên bố đầu tư một khoản tiền lớn vào các công ty nhưng yêu cầu một khoản thanh toán trả trước đáng kể để thực hiện thỏa thuận.{n}Những người thiếu khôn ngoan đã trả tiền sẽ không bao giờ thấy lại số tiền đó nữa.\nCảnh sát đang điều tra nhưng dường như bất lực trong việc ngăn chặn những kẻ lừa đảo quốc tế này."
		}, {
			"value": "OK",
			"translation": "OK"
		}, {
			"value": "The recent pleas for a patch for {0} seem to have been unanswered by {1}.\nMany fans have voiced their disappointment.",
			"comment": "{0} game title, {1} company name",
			"translation": "Những lời kêu gọi gần đây về một bản vá cho {0} dường như không được {1} đáp lại.\nNhiều người hâm mộ đã bày tỏ sự thất vọng của họ."
		}, {
			"value": "Bugs!",
			"comment": "heading",
			"translation": "Lỗi!"
		}, {
			"value": "Oh no! It seems that {0} had quite a few undiscovered bugs when we released it.\nSome of our customers are having a bad time with this and they demand that we patch the game.{n}We could either spend the money and time to patch it or ignore their pleas. If you want to patch the game then {1} on a character and use the action menu to develop a patch but make sure that you don't wait for too long.",
			"comment": "{0} game title, {1} click/touch verb",
			"translation": "Ôi không! Có vẻ như {0} có khá nhiều lỗi chưa được phát hiện khi chúng ta phát hành nó.\nMột số khách hàng của chúng ta đang gặp rắc rối với điều này và họ yêu cầu chúng ta vá lỗi trò chơi.{n}Chúng ta có thể chi tiền và thời gian để vá lỗi hoặc phớt lờ lời kêu gọi của họ. Nếu bạn muốn vá lỗi trò chơi, hãy {1} vào một nhân vật và sử dụng menu hành động để phát triển một bản vá nhưng hãy đảm bảo rằng bạn không đợi quá lâu."
		}, {
			"value": "Administrative Expenses",
			"comment": "label of expense for illegal activity",
			"translation": "Chi phí Hành chính"
		}, {
			"value": "{n}This is a very special offer. Our agents have recently managed to 'borrow' some research information which might be of interest to you.\nIf you are interested then transfer {0} to the enclosed uplink location.\nWe'll contact you, Agent Blowfish",
			"comment": "use writing style of secret agent msg (in game it was decrypted). keep words 'blowfish' and 'uplink' in the message.",
			"translation": "{n}Đây là một đề nghị rất đặc biệt. Các đặc vụ của chúng tôi gần đây đã 'mượn' được một số thông tin nghiên cứu có thể bạn sẽ quan tâm.\nNếu bạn hứng thú, hãy chuyển {0} đến địa điểm uplink đính kèm.\nChúng tôi sẽ liên lạc với bạn, Đặc vụ Blowfish"
		}, {
			"value": "Proposition",
			"comment": "heading",
			"translation": "Đề xuất"
		}, {
			"value": "Decrypt Message",
			"comment": "decision action button",
			"translation": "Giải mã Tin nhắn"
		}, {
			"value": "Transfer ({0})",
			"comment": "decision action button; as in Transfer amount of money",
			"translation": "Chuyển khoản ({0})"
		}, {
			"value": "Thank you for your business.",
			"translation": "Cảm ơn sự hợp tác của bạn."
		}, {
			"value": "You have successfully researched {0}.",
			"comment": "{0} topic name",
			"translation": "Bạn đã nghiên cứu thành công {0}."
		}, {
			"value": "Transaction complete",
			"comment": "heading",
			"translation": "Giao dịch hoàn tất"
		}, {
			"value": "This is a very special offer. Our agents have recently managed to gain access to some critical systems of one of your competitors.\nIf you want to play war games then transfer {0} to the enclosed location and we'll initiate sabotage.,\nAgent Blowfish",
			"comment": "use writing style of secret agent msg (in game it was decrypted). keep words 'war games' and 'blowfish' in the message.",
			"translation": "Đây là một đề nghị rất đặc biệt. Các đặc vụ của chúng tôi gần đây đã truy cập được vào một số hệ thống quan trọng của một trong những đối thủ cạnh tranh của bạn.\nNếu bạn muốn chơi trò chiến tranh thì hãy chuyển {0} đến địa điểm đính kèm và chúng tôi sẽ tiến hành phá hoại.,\nĐặc vụ Blowfish"
		}, {
			"value": "Sabotage ({0})",
			"comment": "decision action button",
			"translation": "Phá hoại ({0})"
		}, {
			"value": "In a statement the game development company {0} has said that they have been the victim of industrial sabotage. Unfortunately development on their current project has been severely affected.\nPolice are investigating.",
			"comment": "{0} is random company name",
			"translation": "Trong một tuyên bố, công ty phát triển game {0} cho biết họ đã là nạn nhân của hành vi phá hoại công nghiệp. Không may là quá trình phát triển dự án hiện tại của họ đã bị ảnh hưởng nghiêm trọng.\nCảnh sát đang điều tra."
		}, {
			"value": "Hi Boss! A friend of mine is greatly involved in an organization which aims to get more women into technology. They are looking for a sponsor and I thought that this would be a perfect opportunity for us.\nWould you like to help out?",
			"translation": "Chào Sếp! Một người bạn của tôi đang tham gia rất tích cực vào một tổ chức nhằm mục đích thu hút nhiều phụ nữ hơn vào lĩnh vực công nghệ. Họ đang tìm kiếm nhà tài trợ và tôi nghĩ đây sẽ là một cơ hội hoàn hảo cho chúng ta.\nSếp có muốn giúp đỡ không?"
		}, {
			"value": "Sponsor (pay {0})",
			"comment": "decision action button",
			"translation": "Tài trợ (trả {0})"
		}, {
			"value": "Sponsorship",
			"comment": "heading",
			"translation": "Tài trợ"
		}, {
			"value": "We have got word that {0} has recently sponsored a highly praised move to get more women into technology roles.\n{1}, the CEO at {0} said, 'We would love to see more women in the game industry.'",
			"comment": "{0} company name, {1} staff name",
			"translation": "Chúng tôi được biết {0} gần đây đã tài trợ cho một động thái rất được hoan nghênh nhằm thu hút thêm phụ nữ vào các vai trò công nghệ.\n{1}, CEO của {0} cho biết, 'Chúng tôi rất mong muốn thấy nhiều phụ nữ hơn trong ngành công nghiệp game.'"
		}, {
			"value": "Boss, it seems that quite a few players use illegal copies of {0}.\nI've managed to identify some of them.\nWe could either sue them to defend our copyright or send them warnings to ask them to stop.\nWhat do you want to do?",
			"comment": "{0} game title",
			"translation": "Sếp ơi, có vẻ như khá nhiều người chơi đang sử dụng các bản sao bất hợp pháp của {0}.\nTôi đã tìm ra được một vài người trong số họ.\nChúng ta có thể kiện họ để bảo vệ bản quyền của mình hoặc gửi cảnh báo yêu cầu họ dừng lại.\nSếp muốn làm gì?"
		}, {
			"value": "Sue them",
			"comment": "decision action button",
			"translation": "Kiện họ"
		}, {
			"value": "Warn them",
			"comment": "decision action button",
			"translation": "Cảnh cáo họ"
		}, {
			"value": "Piracy is an increasingly big problem in the industry. Some companies invest a lot of money and effort to fight piracy while others argue that it's better to take a more relaxed approach and invest in better games instead.",
			"translation": "Vi phạm bản quyền là một vấn đề ngày càng lớn trong ngành. Một số công ty đầu tư rất nhiều tiền bạc và công sức để chống lại vi phạm bản quyền trong khi những công ty khác cho rằng tốt hơn là nên có một cách tiếp cận thoải mái hơn và thay vào đó đầu tư vào các trò chơi tốt hơn."
		}, {
			"value": "We have lost {0} fans but won {1} in legal claims.",
			"comment": "{0} nr of fans, {1} cash amount",
			"translation": "Chúng ta đã mất {0} người hâm mộ nhưng thắng kiện được {1}."
		}, {
			"value": "In what some have called a drastic move, {0} has recently taken legal action against illegal players of their game {1}.",
			"comment": "{0} company name, {1} game name",
			"translation": "Trong một động thái mà một số người gọi là quyết liệt, {0} gần đây đã khởi kiện những người chơi bất hợp pháp trò chơi {1} của họ."
		}, {
			"value": "legal claims",
			"comment": "expense label",
			"translation": "chi phí pháp lý"
		}, {
			"value": "We have gained {0} fans!",
			"translation": "Chúng ta đã có thêm {0} người hâm mộ!"
		}, {
			"value": "{0} has recently sent warnings to several players using illegal copies of their game {1}.",
			"comment": "{0} company name, {1} game title",
			"translation": "{0} gần đây đã gửi cảnh báo đến một số người chơi sử dụng các bản sao bất hợp pháp của trò chơi {1} của họ."
		}, {
			"value": "Boss, I've discovered that some really dedicated fans of {0} have created a fan game using a lot of the material from our game.\nThey don't make any money with it and just seem to do it for fellow fans. Our legal advisors strongly suggest that we shouldn't allow this to go on. What do you want to do?",
			"comment": "{0} game title",
			"translation": "Sếp ơi, tôi phát hiện ra rằng một số người hâm mộ thực sự tận tâm của {0} đã tạo ra một trò chơi do người hâm mộ làm, sử dụng rất nhiều tài liệu từ trò chơi của chúng ta.\nHọ không kiếm tiền từ nó và dường như chỉ làm vì những người hâm mộ khác. Các cố vấn pháp lý của chúng ta kịch liệt đề nghị rằng chúng ta không nên để chuyện này tiếp diễn. Sếp muốn làm gì?"
		}, {
			"value": "Stop them",
			"comment": "decision action button",
			"translation": "Ngăn chặn họ"
		}, {
			"value": "Let them be",
			"comment": "decision action button",
			"translation": "Mặc kệ họ"
		}, {
			"value": "Project disbanded",
			"comment": "heading",
			"translation": "Dự án giải thể"
		}, {
			"value": "Thank you",
			"comment": "heading",
			"translation": "Cảm ơn"
		}, {
			"value": "Hi, I'm Denise Ried the main developer of the {0} fan game. I've recently been informed that your legal department has advised you to stop us and I just wanted to say that I'm very grateful that you didn't.{n}{1} is the best company in the world and I'm glad I can be part of the fan community.",
			"comment": "{0} game name, {1} company name",
			"translation": "Chào bạn, tôi là Denise Ried, nhà phát triển chính của trò chơi {0} do người hâm mộ làm. Gần đây tôi được biết bộ phận pháp lý của bạn đã khuyên bạn ngăn chặn chúng tôi và tôi chỉ muốn nói rằng tôi rất biết ơn vì bạn đã không làm vậy.{n}{1} là công ty tuyệt vời nhất thế giới và tôi rất vui khi được là một phần của cộng đồng người hâm mộ."
		}, {
			"value": "Fans",
			"comment": "heading",
			"translation": "Người hâm mộ"
		}, {
			"value": "We have lost {0} fans!",
			"translation": "Chúng ta đã mất {0} người hâm mộ!"
		}, {
			"value": "Boss, we would like to stage an internal coding contest! I think we could all learn a lot by doing this. As an incentive we would need a prize for the winner ({0}). We agreed that the prize will go to charity. Should we do it?",
			"translation": "Sếp ơi, chúng tôi muốn tổ chức một cuộc thi lập trình nội bộ! Tôi nghĩ tất cả chúng ta có thể học hỏi được rất nhiều từ việc này. Để khích lệ, chúng ta sẽ cần một giải thưởng cho người chiến thắng ({0}). Chúng tôi đã đồng ý rằng giải thưởng sẽ được quyên góp cho từ thiện. Chúng ta có nên làm không?"
		}, {
			"value": "Great! We will start right away!",
			"translation": "Tuyệt vời! Chúng ta sẽ bắt đầu ngay!"
		}, {
			"value": "Okay, maybe another time...",
			"translation": "Được rồi, có lẽ để lần khác..."
		}, {
			"value": "Coding Contest",
			"comment": "heading",
			"translation": "Cuộc thi Lập trình"
		}, {
			"value": "Thanks for agreeing to the coding contest. It was a big success! {0} won the contest and is lucky to distribute the prize of {1} to charity. We have also learned a lot in the process.",
			"translation": "Cảm ơn Sếp đã đồng ý cho cuộc thi lập trình. Đó là một thành công lớn! {0} đã thắng cuộc thi và may mắn được phân phát giải thưởng {1} cho từ thiện. Chúng ta cũng đã học hỏi được rất nhiều trong quá trình này."
		}, {
			"value": "Boss, someone seems to have stolen our credit card information and used it to buy a lot of things in the past three months. Unfortunately we have lost {0}!",
			"translation": "Sếp ơi, có vẻ như ai đó đã đánh cắp thông tin thẻ tín dụng của chúng ta và dùng nó để mua rất nhiều thứ trong ba tháng qua. Không may là chúng ta đã mất {0}!"
		}, {
			"value": "EPA",
			"comment": "heading for 'Environmental Protection Agency' story",
			"translation": "Cơ quan Bảo vệ Môi trường"
		}, {
			"value": "I am an employee of the Environmental Protection Agency and have an offer for you. Your company has a high electrical footprint right now. If you would install solar panels you could decrease your footprint and save money in the long run. We would sponsor 50% of the costs which brings your investment to {0}!\nWould you like to install it?",
			"comment": "headings for this story need to use acronym consistent with the Environmental Protection Agency translation. look for 'heading for 'Environmental Protection Agency' story'",
			"translation": "Tôi là một nhân viên của Cơ quan Bảo vệ Môi trường và tôi có một đề nghị cho bạn. Công ty của bạn hiện đang có lượng tiêu thụ điện rất cao. Nếu bạn lắp đặt các tấm pin mặt trời, bạn có thể giảm lượng tiêu thụ điện và tiết kiệm tiền về lâu dài. Chúng tôi sẽ tài trợ 50% chi phí, đưa khoản đầu tư của bạn xuống còn {0}!\nBạn có muốn lắp đặt không?"
		}, {
			"value": "Install (pay {0})",
			"comment": "decision action button",
			"translation": "Lắp đặt (trả {0})"
		}, {
			"value": "Ignore offer",
			"comment": "decision action button",
			"translation": "Bỏ qua đề nghị"
		}, {
			"value": "solar panels",
			"comment": "heading",
			"translation": "tấm pin mặt trời"
		}, {
			"value": "Great, it was a wise decision installing a solar collector!",
			"translation": "Tuyệt vời, lắp đặt bộ thu năng lượng mặt trời là một quyết định sáng suốt!"
		}, {
			"value": "{0} has recently installed solar panels in their offices. While the video game and software industries are one of the cleanest industries on earth they do eat up a lot of electricity so installing solar panels can really make an impact.",
			"comment": "{0} company name",
			"translation": "{0} gần đây đã lắp đặt các tấm pin mặt trời trong văn phòng của họ. Mặc dù ngành công nghiệp trò chơi điện tử và phần mềm là một trong những ngành công nghiệp sạch nhất trên trái đất nhưng chúng tiêu thụ rất nhiều điện, vì vậy việc lắp đặt các tấm pin mặt trời thực sự có thể tạo ra tác động."
		}, {
			"value": "Sorry to hear that you are declining our offer",
			"translation": "Rất tiếc khi biết bạn từ chối lời đề nghị của chúng tôi"
		}, {
			"value": "Boss, it's way too hot in our office and the heat is starting to impact on our work. I've researched and found an air conditioner which would be perfect for us. It costs {0}.\nShould we order it?",
			"translation": "Sếp ơi, văn phòng mình nóng quá và cái nóng bắt đầu ảnh hưởng đến công việc của chúng ta rồi. Tôi đã tìm hiểu và tìm được một cái máy lạnh hoàn hảo cho chúng ta. Nó có giá {0}.\nChúng ta có nên đặt mua không?"
		}, {
			"value": "Yes (pay {0})",
			"comment": "decision action button",
			"translation": "Có (trả {0})"
		}, {
			"value": "air conditioner",
			"comment": "heading",
			"translation": "máy điều hòa"
		}, {
			"value": "Boss, the heat is becoming a serious problem. Just yesterday my mouse melted and my keyboard is covered in sweat. Not a good environment to work in. We really need an air conditioner.{n}Unfortunately the previous offer has expired and we would need to pay {0}.\nShould we order it?",
			"comment": "try to make the reason lightweight and fun",
			"translation": "Sếp ơi, cái nóng đang trở thành một vấn đề nghiêm trọng. Mới hôm qua con chuột của tôi chảy nhựa và bàn phím thì đầy mồ hôi. Đây không phải là một môi trường làm việc tốt. Chúng ta thực sự cần một cái máy lạnh.{n}Không may là ưu đãi trước đó đã hết hạn và chúng ta sẽ phải trả {0}.\nChúng ta có nên đặt mua không?"
		}, {
			"value": "Boss, We've had enough and ordered the air conditioner ourselves. Thanks for nothing.",
			"translation": "Sếp ơi, chúng tôi chịu hết nổi rồi và đã tự đặt mua máy lạnh. Cảm ơn vì không làm gì cả."
		}, {
			"value": "Dave Johnson here, CEO of Departure Science. Some of our test subjects were recently exposed to some of your games and, surprisingly, they didn't go totally insane. They seemed to quite enjoy the experience in fact. Anyway, I have some products that need advertising and could do with some product placement.{n}My marketing boys tell me that making you this offer is a bad idea but that's exactly why I want it. I'll pay you {0} to place some of our fine red painted exploding barrels in one of your games. What'd ya say?",
			"comment": "see Portal 2 reference hint",
			"translation": "Dave Johnson đây, CEO của Departure Science. Một số đối tượng thử nghiệm của chúng tôi gần đây đã tiếp xúc với một vài trò chơi của bạn và, thật ngạc nhiên, họ không hoàn toàn phát điên. Thực tế là họ có vẻ khá thích thú với trải nghiệm đó. Dù sao thì, tôi có một số sản phẩm cần quảng cáo và có thể sử dụng một chút quảng cáo sản phẩm.{n}Mấy cậu bé marketing của tôi nói rằng đưa ra lời đề nghị này cho bạn là một ý tưởng tồi nhưng đó chính xác là lý do tại sao tôi muốn nó. Tôi sẽ trả bạn {0} để đặt một vài thùng thuốc nổ sơn đỏ tuyệt đẹp của chúng tôi vào một trong những trò chơi của bạn. Bạn thấy sao?"
		}, {
			"value": "Product Placement",
			"comment": "heading",
			"translation": "Quảng cáo Sản phẩm"
		}, {
			"value": "Sure!",
			"comment": "decision action button",
			"translation": "Chắc chắn rồi!"
		}, {
			"value": "Departure Science",
			"comment": "see Portal 2 reference hint",
			"translation": "Departure Science"
		}, {
			"value": "Excellent! Good to hear you have some spirit in you. One more thing: Don't feel like you have to go and rush those barrels into your next game. I'd rather have you place them in a game where they fit well.\nJohnson out.",
			"comment": "see Portal 2 reference hint",
			"translation": "Tuyệt vời! Rất vui khi biết bạn có tinh thần như vậy. Một điều nữa: Đừng cảm thấy bạn phải vội vàng đưa những thùng thuốc nổ đó vào trò chơi tiếp theo của mình. Tôi muốn bạn đặt chúng vào một trò chơi mà chúng phù hợp hơn.\nJohnson đây."
		}, {
			"value": "Dave Johnson here! Listen! You did well placing our beloved barrels in {0} - my marketing eggheads say profits are increasing which means more science for us. Well done. Here, have this cake.",
			"comment": "see Portal 2 reference hint",
			"translation": "Dave Johnson đây! Nghe này! Bạn đã làm rất tốt khi đặt những thùng thuốc nổ yêu quý của chúng tôi vào {0} - mấy tay marketing của tôi nói rằng lợi nhuận đang tăng lên, điều đó có nghĩa là chúng ta có thêm kinh phí cho khoa học. Làm tốt lắm. Đây, mời bạn miếng bánh."
		}, {
			"value": "Dave Johnson here! Listen! Those red exploding barrels I'd asked you to place in your game. Well, seems that folks didn't really enjoy them as much in {0}. Oh well, was worth a try.",
			"comment": "see Portal 2 reference hint",
			"translation": "Dave Johnson đây! Nghe này! Mấy cái thùng thuốc nổ đỏ mà tôi nhờ bạn đặt vào game ấy. Chà, có vẻ như mọi người không thực sự thích chúng trong {0} cho lắm. Thôi kệ, dù sao cũng đáng để thử."
		}, {
			"value": "Message",
			"comment": "heading",
			"translation": "Tin nhắn"
		}, {
			"value": "It seems that you have some serious financial difficulties and your company is about to go bankrupt. After careful consideration we have decided to offer you a deal.",
			"translation": "Có vẻ như bạn đang gặp một số khó khăn tài chính nghiêm trọng và công ty của bạn sắp phá sản. Sau khi xem xét cẩn thận, chúng tôi đã quyết định đưa ra một thỏa thuận cho bạn."
		}, {
			"value": "We will give you {0} which should move you out of the danger zone but in return you have to commit to pay us {1} in a year's time.",
			"translation": "Chúng tôi sẽ cho bạn {0} để giúp bạn thoát khỏi vùng nguy hiểm nhưng đổi lại bạn phải cam kết trả cho chúng tôi {1} trong vòng một năm."
		}, {
			"value": "Bank offer",
			"comment": "heading",
			"translation": "Đề nghị từ Ngân hàng"
		}, {
			"value": "Agree (receive {0})",
			"comment": "decision action button",
			"translation": "Đồng ý (nhận {0})"
		}, {
			"value": "No (go bankrupt)",
			"comment": "decision action button",
			"translation": "Không (phá sản)"
		}, {
			"value": "Bailout",
			"comment": "heading",
			"translation": "Gói cứu trợ"
		}, {
			"value": "Bank",
			"comment": "heading",
			"translation": "Ngân hàng"
		}, {
			"value": "This is a reminder that we require you to pay back the agreed amount of {0} in three months' time.",
			"translation": "Đây là lời nhắc nhở rằng chúng tôi yêu cầu bạn hoàn trả số tiền đã thỏa thuận là {0} trong vòng ba tháng tới."
		}, {
			"value": "The amount of {0} has been deducted from your account.",
			"translation": "Số tiền {0} đã được khấu trừ khỏi tài khoản của bạn."
		}, {
			"value": "Bailout payback",
			"comment": "heading",
			"translation": "Hoàn trả gói cứu trợ"
		}, {
			"value": "Boss, I think it's time to announce the {0} to the world. Should we go ahead and make a press release?",
			"comment": "{0} custom console name",
			"translation": "Sếp ơi, tôi nghĩ đã đến lúc công bố {0} cho cả thế giới biết. Chúng ta có nên tiến hành họp báo không?"
		}, {
			"value": "Announce",
			"comment": "decision action button",
			"translation": "Công bố"
		}, {
			"value": "Don't announce",
			"comment": "decision action button",
			"translation": "Không công bố"
		}, {
			"value": "In a surprise announcement {0}, a company known for games such as {1} has revealed that they have been working on their very own game console. The console which is called {2} is said to compete with the high end consoles from companies like Mirconoft and Vonny.{n}We are eager to see how much of an impact this new console will have.",
			"translation": "Trong một thông báo bất ngờ, {0}, một công ty nổi tiếng với các trò chơi như {1} đã tiết lộ rằng họ đang phát triển một máy chơi game của riêng mình. Máy chơi game này có tên là {2} được cho là sẽ cạnh tranh với các máy chơi game cao cấp từ các công ty như Mirconoft và Vonny.{n}Chúng tôi rất nóng lòng muốn xem máy chơi game mới này sẽ có tác động lớn đến mức nào."
		}, {
			"value": " which had only limited commercial success.",
			"comment": "consoleAnnouncementPastSuccessFragment",
			"translation": " chỉ đạt được thành công thương mại hạn chế."
		}, {
			"value": "which had moderate commercial success.",
			"comment": "consoleAnnouncementPastSuccessFragment",
			"translation": "đã đạt được thành công thương mại ở mức vừa phải."
		}, {
			"value": "which had a sizeable following and really made an impact in the market.",
			"comment": "consoleAnnouncementPastSuccessFragment",
			"translation": "đã có một lượng người theo dõi đáng kể và thực sự tạo ra tác động trên thị trường."
		}, {
			"value": "{0} has announced that they are working on a new game console. The console named {1} is planned as a successor to their earlier contender, the {2} ",
			"comment": "{2} is consoleAnnouncementPastSuccessFragment",
			"translation": "{0} đã thông báo rằng họ đang phát triển một máy chơi game mới. Máy chơi game có tên {1} được lên kế hoạch là người kế nhiệm cho đối thủ cạnh tranh trước đó của họ, {2} "
		}, {
			"value": "I will get right to it.",
			"translation": "Tôi sẽ làm ngay."
		}, {
			"value": "Okay, you are the boss.",
			"translation": "Được rồi, Sếp là nhất."
		}, {
			"value": "Congratulations on finishing Game Dev Tycoon and thank you for playing! If you enjoyed our little game then please consider rating the game on the Store. You can also send us some feedback",
			"comment": "gameFinishMsg, either stops with a . or continues with fragment",
			"translation": "Chúc mừng bạn đã hoàn thành Game Dev Tycoon và cảm ơn bạn đã chơi! Nếu bạn thích trò chơi nhỏ của chúng tôi thì hãy xem xét việc đánh giá trò chơi trên Cửa hàng. Bạn cũng có thể gửi cho chúng tôi một số phản hồi"
		}, {
			"value": " and, if you really loved the game, you can (if you wish) vote with your wallet to support us even further.",
			"comment": "fragment of gameFinishMsg",
			"translation": " và, nếu bạn thực sự yêu thích trò chơi, bạn có thể (nếu muốn) ủng hộ chúng tôi bằng ví tiền của mình để hỗ trợ chúng tôi nhiều hơn nữa."
		}, {
			"value": "See options...",
			"comment": "decision action button",
			"translation": "Xem tùy chọn..."
		}, {
			"value": "No, thanks",
			"comment": "decision action button",
			"translation": "Không, cảm ơn"
		}, {
			"value": "Continue game",
			"comment": "heading",
			"translation": "Tiếp tục trò chơi"
		}, {
			"value": "Audio Settings",
			"translation": "Cài đặt Âm thanh"
		}, {
			"value": "Help",
			"translation": "Trợ giúp"
		}, {
			"value": "About",
			"translation": "Giới thiệu"
		}, {
			"value": "Feedback & Support",
			"translation": "Phản hồi & Hỗ trợ"
		}, {
			"value": "Privacy Policy (online)",
			"translation": "Chính sách Bảo mật (trực tuyến)"
		}, {
			"value": ">> Lite Version <<",
			"translation": ">> Phiên bản Lite <<"
		}, {
			"value": ">> Trial <<",
			"translation": ">> Dùng thử <<"
		}, {
			"value": "Tap to start game ...",
			"translation": "Chạm để bắt đầu trò chơi ..."
		}, {
			"value": "Click to start game ...",
			"translation": "Nhấp để bắt đầu trò chơi ..."
		}, {
			"value": "Starting game...",
			"translation": "Đang bắt đầu trò chơi..."
		}, {
			"value": "Click to continue ...",
			"translation": "Nhấp để tiếp tục ..."
		}, {
			"value": "Starting ...",
			"translation": "Đang bắt đầu ..."
		}, {
			"value": "Finishing ...",
			"translation": "Đang hoàn thiện ..."
		}, {
			"value": "Completed: ",
			"comment": "research is completed, research name is added",
			"translation": "Đã hoàn thành: "
		}, {
			"value": "Research complete",
			"comment": "heading",
			"translation": "Nghiên cứu hoàn tất"
		}, {
			"value": "You have successfully researched a new topic: '{0}'.",
			"translation": "Bạn đã nghiên cứu thành công một chủ đề mới: '{0}'."
		}, {
			"value": "You have successfully researched '{0}'.",
			"translation": "Bạn đã nghiên cứu thành công '{0}'."
		}, {
			"value": "Engine complete!",
			"comment": "heading",
			"translation": "Engine hoàn tất!"
		}, {
			"value": "Your new game engine '{0}' is now complete!",
			"translation": "Game engine mới '{0}' của bạn đã hoàn tất!"
		}, {
			"value": "If the issue persists please report this error to {0}",
			"translation": "Nếu sự cố vẫn tiếp diễn, vui lòng báo cáo lỗi này cho {0}"
		}, {
			"value": "Your bank account is in the red.\nThankfully your bank has enabled you to overdraw your account up to {0} but be careful, if your account balance is below -{0} you will go bankrupt.",
			"translation": "Tài khoản ngân hàng của bạn đang âm.\nRất may là ngân hàng của bạn đã cho phép bạn thấu chi tài khoản lên đến {0} nhưng hãy cẩn thận, nếu số dư tài khoản của bạn dưới -{0} bạn sẽ phá sản."
		}, {
			"value": "Warning",
			"comment": "heading",
			"translation": "Cảnh báo"
		}, {
			"value": "Unfortunately you are bankrupt.",
			"translation": "Thật không may, bạn đã phá sản."
		}, {
			"value": "We have just got confirmation that {0}, which has been in financial trouble lately, has gone bankrupt.\nIt appears that {1}, a behemoth in the gaming industry, has purchased the remains of the company.",
			"translation": "Chúng tôi vừa nhận được xác nhận rằng {0}, vốn đang gặp khó khăn về tài chính gần đây, đã phá sản.\nCó vẻ như {1}, một gã khổng lồ trong ngành công nghiệp game, đã mua lại phần còn lại của công ty."
		}, {
			"value": "A spokesperson of {0} said, 'We are very excited to have acquired the rights to all of {1} previously released titles.'\n\nHearing this news, many fans of {1} have expressed their disappointment.",
			"translation": "Một phát ngôn viên của {0} cho biết, 'Chúng tôi rất vui mừng khi đã mua được bản quyền của tất cả các tựa game đã phát hành trước đây của {1}.'\n\nNghe tin này, nhiều người hâm mộ của {1} đã bày tỏ sự thất vọng của họ."
		}, {
			"value": "Breaking News",
			"comment": "heading",
			"translation": "Tin nóng"
		}, {
			"value": "dev. license",
			"comment": "used as {platformname} dev. license",
			"translation": "giấy phép phát triển"
		}, {
			"value": "I love your work",
			"comment": "contractDescrFragment",
			"translation": "Tôi yêu thích công việc của bạn"
		}, {
			"value": "I am impressed by your talent",
			"comment": "contractDescrFragment",
			"translation": "Tôi rất ấn tượng với tài năng của bạn"
		}, {
			"value": "I think you have potential",
			"comment": "contractDescrFragment",
			"translation": "Tôi nghĩ bạn có tiềm năng"
		}, {
			"value": "Hi there,\nI've just finished {0} and {1}.\nI'm in the contracting business and we could use skills like yours. If you are ever short on cash just let me know and I will see if I have some work for you.\nJason",
			"comment": "{1} is contractDescrFragment",
			"translation": "Chào bạn,\nTôi vừa hoàn thành {0} và {1}.\nTôi đang làm trong lĩnh vực hợp đồng và chúng tôi có thể cần những kỹ năng như của bạn. Nếu bạn có lúc nào thiếu tiền mặt, hãy cho tôi biết và tôi sẽ xem liệu có công việc nào cho bạn không.\nJason"
		}, {
			"value": "Contract Work",
			"comment": "heading",
			"translation": "Công việc Hợp đồng"
		}, {
			"value": "Hi again,\nI heard that you've been very successful in the gaming business and are starting to grow your team.\nI've updated our client list, so if you are looking for some contract work let me know.\nJason{n}Medium sized contracts have been unlocked.",
			"translation": "Chào bạn lần nữa,\nTôi nghe nói bạn đã rất thành công trong lĩnh vực kinh doanh game và đang bắt đầu mở rộng đội ngũ của mình.\nTôi đã cập nhật danh sách khách hàng của chúng tôi, vì vậy nếu bạn đang tìm kiếm một số công việc hợp đồng, hãy cho tôi biết.\nJason{n}Các hợp đồng quy mô vừa đã được mở khóa."
		}, {
			"value": "Wow, I have seen some pictures of your new office! Cutting edge stuff!\nI'm sure you are doing very well but if you need to top up your budget I've a couple of big jobs that need to be taken care of.\nJason{n}Large contracts have been unlocked.",
			"translation": "Wow, tôi đã xem một vài bức ảnh về văn phòng mới của bạn! Thật hiện đại!\nTôi chắc chắn bạn đang làm rất tốt nhưng nếu bạn cần thêm ngân sách, tôi có một vài công việc lớn cần được giải quyết.\nJason{n}Các hợp đồng lớn đã được mở khóa."
		}, {
			"value": "Jason here.\nI just got word from the client that the contract was completed successfully. Excellent work!",
			"translation": "Jason đây.\nTôi vừa nhận được thông báo từ khách hàng rằng hợp đồng đã được hoàn thành thành công. Làm tốt lắm!"
		}, {
			"value": "Jason here.\nI see that the contract was not completed in time. Be careful what contracts you accept otherwise those penalties quickly add up.{n}Don't worry too much though, I don't hold grudges. If you want to try again let me know.",
			"translation": "Jason đây.\nTôi thấy hợp đồng không được hoàn thành đúng hạn. Hãy cẩn thận với những hợp đồng bạn chấp nhận nếu không những khoản phạt đó sẽ nhanh chóng tăng lên.{n}Tuy nhiên, đừng quá lo lắng, tôi không thù dai đâu. Nếu bạn muốn thử lại, hãy cho tôi biết."
		}, {
			"value": "Usually I have new contracts every six months so check back some time.",
			"translation": "Thường thì cứ sáu tháng tôi lại có hợp đồng mới, vì vậy hãy kiểm tra lại sau một thời gian nhé."
		}, {
			"value": "Up-front payment",
			"comment": "heading",
			"translation": "Thanh toán trả trước"
		}, {
			"value": "Contract Refund",
			"comment": "heading",
			"translation": "Hoàn trả Hợp đồng"
		}, {
			"value": "Graphic",
			"translation": "Đồ họa"
		}, {
			"value": "Popular genre: ",
			"translation": "Thể loại phổ biến: "
		}, {
			"value": "Popular: New topics",
			"translation": "Phổ biến: Chủ đề mới"
		}, {
			"value": "Strong audience: ",
			"translation": "Đối tượng mạnh: "
		}, {
			"value": "Trend: Strange combinations",
			"translation": "Xu hướng: Kết hợp kỳ lạ"
		}, {
			"value": "It seems that the market has normalized again with no particular strong trends at the moment.",
			"translation": "Có vẻ như thị trường đã bình thường trở lại và hiện tại không có xu hướng mạnh mẽ nào đặc biệt."
		}, {
			"value": "It seems that {0} games are especially popular at the moment.",
			"translation": "Có vẻ như các trò chơi {0} đang đặc biệt phổ biến vào lúc này."
		}, {
			"value": "There is a clear trend towards {0} games recently.",
			"translation": "Gần đây có một xu hướng rõ ràng đối với các trò chơi {0}."
		}, {
			"value": "It seems that the market responds particularly well to games with new topics at the moment.",
			"translation": "Có vẻ như thị trường hiện tại đang phản ứng đặc biệt tốt với các trò chơi có chủ đề mới."
		}, {
			"value": "Market Analysis",
			"comment": "heading",
			"translation": "Phân tích Thị trường"
		}, {
			"value": "Grid income",
			"comment": "heading",
			"translation": "Thu nhập từ Grid"
		}, {
			"value": "Our own game convention is taking place in 4 weeks!",
			"translation": "Hội nghị game của riêng chúng ta sẽ diễn ra trong 4 tuần nữa!"
		}, {
			"value": "In two months the {0} will be taken off the market!",
			"translation": "Trong hai tháng nữa, {0} sẽ bị rút khỏi thị trường!"
		}, {
			"value": "{0} is no longer supported.\nYou've released {1} games for the platform and earned a total of {2}!",
			"translation": "{0} không còn được hỗ trợ nữa.\nBạn đã phát hành {1} trò chơi cho nền tảng này và kiếm được tổng cộng {2}!"
		}, {
			"value": "{0} is no longer supported.",
			"translation": "{0} không còn được hỗ trợ nữa."
		}, {
			"value": "We had {0} people visiting our booth this year.",
			"translation": "Năm nay chúng ta đã có {0} người ghé thăm gian hàng của mình."
		}, {
			"value": "We didn't make it in the top 100 booths this year. Once we gain more fans I'm sure we will!",
			"translation": "Năm nay chúng ta không lọt vào top 100 gian hàng. Một khi chúng ta có thêm người hâm mộ, tôi chắc chắn chúng ta sẽ làm được!"
		}, {
			"value": "We were voted the number one booth this year! Congratulations!",
			"translation": "Chúng ta đã được bình chọn là gian hàng số một năm nay! Xin chúc mừng!"
		}, {
			"value": "Our convention had {0} visitors this year!",
			"translation": "Hội nghị của chúng ta đã có {0} khách tham quan trong năm nay!"
		}, {
			"value": "Game Conference",
			"comment": "heading",
			"translation": "Hội nghị Game"
		}, {
			"value": "monthly costs",
			"comment": "heading",
			"translation": "chi phí hàng tháng"
		}, {
			"value": "Young",
			"comment": "audience category",
			"translation": "Trẻ"
		}, {
			"value": "Mature",
			"comment": "audience category",
			"translation": "Trưởng thành"
		}, {
			"value": "Everyone",
			"comment": "audience category",
			"translation": "Mọi lứa tuổi"
		}, {
			"value": "in the coming years",
			"comment": "date referal sentence fragment",
			"translation": "trong những năm tới"
		}, {
			"value": "early next year",
			"comment": "date referal sentence fragment",
			"translation": "đầu năm sau"
		}, {
			"value": "late next year",
			"comment": "date referal sentence fragment",
			"translation": "cuối năm sau"
		}, {
			"value": "later next year",
			"comment": "date referal sentence fragment",
			"translation": "cuối năm sau nữa"
		}, {
			"value": "later this month",
			"comment": "date referal sentence fragment",
			"translation": "cuối tháng này"
		}, {
			"value": "next month",
			"comment": "date referal sentence fragment",
			"translation": "tháng tới"
		}, {
			"value": "in two months",
			"comment": "date referal sentence fragment",
			"translation": "trong hai tháng nữa"
		}, {
			"value": "in the coming months",
			"comment": "date referal sentence fragment",
			"translation": "trong những tháng tới"
		}, {
			"value": "at the end of this year",
			"comment": "date referal sentence fragment",
			"translation": "vào cuối năm nay"
		}, {
			"value": "later this year",
			"comment": "date referal sentence fragment",
			"translation": "cuối năm nay"
		}, {
			"value": "Recent market studies suggest that the Govodore G64 is steadily outselling competitors in the PC sector. Consumers prefer the lower price, greater availability and the flexible hardware configuration over other home computers.{n}Experts say that this might spell the end of competing hardware manufacturers.",
			"translation": "Các nghiên cứu thị trường gần đây cho thấy Govodore G64 đang dần vượt mặt các đối thủ cạnh tranh trong lĩnh vực PC. Người tiêu dùng ưa chuộng mức giá thấp hơn, tính sẵn có cao hơn và cấu hình phần cứng linh hoạt hơn so với các máy tính gia đình khác.{n}Các chuyên gia cho rằng điều này có thể báo hiệu sự kết thúc của các nhà sản xuất phần cứng cạnh tranh."
		}, {
			"value": "Recent market data shows that the Govodore G64 seems to be slowly losing market share against other PC manufacturers.{n}In an unofficial statement a G64 employee said that the company has been unsuccessful in introducing higher priced computers to compete against newer and more advanced PCs.",
			"translation": "Dữ liệu thị trường gần đây cho thấy Govodore G64 dường như đang dần mất thị phần vào tay các nhà sản xuất PC khác.{n}Trong một tuyên bố không chính thức, một nhân viên G64 cho biết công ty đã không thành công trong việc giới thiệu các máy tính giá cao hơn để cạnh tranh với các PC mới hơn và tiên tiến hơn."
		}, {
			"value": "Hardware manufacturers around the world were surprised today as Govodore, the creator of the popular G64, has filed for bankruptcy.{n}Govodore failed to introduce a higher priced alternative and was forced to shut down production of the G64. The platform will retire from the market {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Các nhà sản xuất phần cứng trên toàn thế giới đã rất ngạc nhiên hôm nay khi Govodore, nhà sáng tạo ra G64 nổi tiếng, đã nộp đơn xin phá sản.{n}Govodore đã không thể giới thiệu một giải pháp thay thế giá cao hơn và buộc phải ngừng sản xuất G64. Nền tảng này sẽ rút khỏi thị trường {0}."
		}, {
			"value": "According to rumours the Japanese company Ninvento is planning to launch its very own home gaming console. Ninvento is known for the widely successful arcade game 'Dinkey King'.{n}Many industry experts doubt that home gaming consoles will take off but we are eager to see what Ninvento will deliver.",
			"translation": "Theo tin đồn, công ty Nhật Bản Ninvento đang có kế hoạch ra mắt máy chơi game gia đình của riêng mình. Ninvento nổi tiếng với trò chơi arcade rất thành công 'Dinkey King'.{n}Nhiều chuyên gia trong ngành nghi ngờ rằng máy chơi game gia đình sẽ thành công nhưng chúng tôi rất nóng lòng muốn xem Ninvento sẽ mang đến điều gì."
		}, {
			"value": "Today, Ninvento has confirmed recent rumours and announced their plans to release a new home gaming console called 'TES' {0}.\nThe console features cartridge based games and a uniquely designed controller.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Hôm nay, Ninvento đã xác nhận những tin đồn gần đây và công bố kế hoạch phát hành một máy chơi game gia đình mới có tên 'TES' {0}.\nMáy chơi game này sử dụng các trò chơi dựa trên băng cạc-trít và một tay cầm điều khiển được thiết kế độc đáo."
		}, {
			"value": "Recent studies suggest that the increasing variety of gaming devices also creates a market for more specialized games.\nSome platforms become more popular with younger gamers while others cater for the more mature age groups.{n}As more and more developers enter the market we expect developers to focus their games on specific age groups to really make an impact.",
			"translation": "Các nghiên cứu gần đây cho thấy sự đa dạng ngày càng tăng của các thiết bị chơi game cũng tạo ra một thị trường cho các trò chơi chuyên biệt hơn.\nMột số nền tảng trở nên phổ biến hơn với những người chơi game trẻ tuổi trong khi những nền tảng khác phục vụ cho các nhóm tuổi trưởng thành hơn.{n}Khi ngày càng có nhiều nhà phát triển tham gia thị trường, chúng tôi kỳ vọng các nhà phát triển sẽ tập trung trò chơi của họ vào các nhóm tuổi cụ thể để thực sự tạo ra tác động."
		}, {
			"value": "The recently released TES home console by Ninvento has proven to be a massive success. Sales numbers have exceeded expectations by far.{n}As one customer says: 'I love the games that come with the TES and playing with a controller is so much more fun than on a keyboard.'",
			"translation": "Máy chơi game gia đình TES mới được phát hành gần đây của Ninvento đã chứng tỏ là một thành công lớn. Doanh số bán hàng đã vượt xa mong đợi.{n}Như một khách hàng nói: 'Tôi yêu thích các trò chơi đi kèm với TES và chơi bằng tay cầm điều khiển thú vị hơn nhiều so với trên bàn phím.'"
		}, {
			"value": "Following the massive success of the TES console there are now rumours circulating that Vena, another Japanese company, is planning to release a home gaming console on their own.",
			"translation": "Sau thành công vang dội của máy chơi game TES, hiện đang có tin đồn lan truyền rằng Vena, một công ty Nhật Bản khác, đang có kế hoạch tự mình phát hành một máy chơi game gia đình."
		}, {
			"value": "Today, Vena has confirmed recent rumours about a new gaming console and announced the Master V.\nThe company claims that the Master V is technically superior to the massively successful TES by Ninvento and plans to release it {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Hôm nay, Vena đã xác nhận những tin đồn gần đây về một máy chơi game mới và công bố Master V.\nCông ty tuyên bố rằng Master V vượt trội về mặt kỹ thuật so với TES cực kỳ thành công của Ninvento và có kế hoạch phát hành nó {0}."
		}, {
			"value": "The recently released gaming console, Master V by Vena, has stirred up the market worldwide.\nIndustry experts say that the console is not very well marketed in North America but that it will flourish in other parts of the world.",
			"translation": "Máy chơi game mới được phát hành gần đây, Master V của Vena, đã khuấy động thị trường toàn cầu.\nCác chuyên gia trong ngành cho biết máy chơi game này không được quảng bá tốt ở Bắc Mỹ nhưng sẽ phát triển mạnh ở các khu vực khác trên thế giới."
		}, {
			"value": "With the growing interest in video games there is also a growing audience for video game magazines. These magazines offer a great new way for game developers to market their upcoming games.",
			"translation": "Với sự quan tâm ngày càng tăng đối với trò chơi điện tử, cũng có một lượng khán giả ngày càng tăng đối với các tạp chí trò chơi điện tử. Những tạp chí này mang đến một cách mới tuyệt vời để các nhà phát triển game quảng bá các trò chơi sắp ra mắt của họ."
		}, {
			"value": "Today, Ninvento has announced that they will introduce a portable gaming device called Gameling. The device comes with changeable game cartridges, a monochrome screen on a green background, built-in speakers and even multiplayer support via a connection cable.{n}Compared to PCs and other gaming consoles the Gameling is underpowered but given the lower cost and excellent portability it might find a huge following.{n}The Gameling is said to hit shelves {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Hôm nay, Ninvento đã thông báo rằng họ sẽ giới thiệu một thiết bị chơi game cầm tay có tên là Gameling. Thiết bị này đi kèm với các băng trò chơi có thể thay đổi, màn hình đơn sắc trên nền xanh lá cây, loa tích hợp và thậm chí hỗ trợ nhiều người chơi thông qua cáp kết nối.{n}So với PC và các máy chơi game khác, Gameling có cấu hình yếu hơn nhưng với chi phí thấp hơn và tính di động tuyệt vời, nó có thể thu hút một lượng lớn người theo dõi.{n}Gameling được cho là sẽ lên kệ {0}."
		}, {
			"value": "Vena, creator of the Master V console, has announced the Vena Gear, a portable console to directly compete against the Gameling from Ninvento.{n}A spokesperson for the company said, 'Unlike similar devices on the market which don't come close to gaming consoles the Vena Gear has basically the full power of the Master V, except that you can take it with you. The Vena Gear also has a full color screen'.{n}Will this device topple the Gameling? We will see. The Vena Gear will debut {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Vena, nhà sản xuất máy chơi game Master V, đã công bố Vena Gear, một máy chơi game cầm tay để cạnh tranh trực tiếp với Gameling của Ninvento.{n}Một phát ngôn viên của công ty cho biết, 'Không giống như các thiết bị tương tự trên thị trường không thể sánh được với máy chơi game, Vena Gear về cơ bản có đầy đủ sức mạnh của Master V, ngoại trừ việc bạn có thể mang theo bên mình. Vena Gear cũng có màn hình màu đầy đủ'.{n}Liệu thiết bị này có lật đổ được Gameling không? Chúng ta sẽ xem. Vena Gear sẽ ra mắt {0}."
		}, {
			"value": "Vena has announced that they will release a new gaming console {0}. The Vena Oasis comes with 16-bit graphics and sound which promises a new kind of gaming experience.{n}Vena said at the announcement, 'The Oasis is a new start, it will be the genesis of a new generation of gaming consoles and we believe it will do very well in the market'. Some of the games already announced for the console suggest that it will appeal to more mature audiences.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Vena đã thông báo rằng họ sẽ phát hành một máy chơi game mới {0}. Vena Oasis đi kèm với đồ họa và âm thanh 16-bit hứa hẹn một trải nghiệm chơi game mới mẻ.{n}Vena cho biết tại buổi công bố, 'Oasis là một khởi đầu mới, nó sẽ là khởi nguồn của một thế hệ máy chơi game mới và chúng tôi tin rằng nó sẽ hoạt động rất tốt trên thị trường'. Một số trò chơi đã được công bố cho máy chơi game này cho thấy nó sẽ thu hút những đối tượng người chơi trưởng thành hơn."
		}, {
			"value": "Today, Ninvento announced the much anticipated successor to the popular TES console. 'This is the greatest console we have ever built. It comes with state of the art 16-bit graphics and sound. It is simply super and that's why we decided to call it the Super TES!'.{n}Fans around the world have been waiting for this moment and it seems that they will not be disappointed.",
			"translation": "Hôm nay, Ninvento đã công bố người kế nhiệm rất được mong đợi cho máy chơi game TES nổi tiếng. 'Đây là máy chơi game tuyệt vời nhất mà chúng tôi từng chế tạo. Nó đi kèm với đồ họa và âm thanh 16-bit tiên tiến nhất. Nó đơn giản là siêu phẩm và đó là lý do tại sao chúng tôi quyết định gọi nó là Super TES!'.{n}Người hâm mộ trên toàn thế giới đã chờ đợi khoảnh khắc này và có vẻ như họ sẽ không phải thất vọng."
		}, {
			"value": "The media is abuzz with the latest news from this year's Entertainment Conference. In a surprise announcement Vonny, a company known for general electronics has presented a prototype console called the Play System.{n}Apparently Vonny has collaborated with Ninvento, creators of the beloved and successful TES and Super TES consoles to develop what is basically a Super TES with a CD drive.{n}This would be the world's first console using a CD drive.",
			"translation": "Giới truyền thông đang xôn xao với những tin tức mới nhất từ Hội nghị Giải trí năm nay. Trong một thông báo bất ngờ, Vonny, một công ty nổi tiếng về điện tử gia dụng đã giới thiệu một nguyên mẫu máy chơi game có tên là Play System.{n}Rõ ràng Vonny đã hợp tác với Ninvento, nhà sản xuất các máy chơi game TES và Super TES được yêu thích và thành công, để phát triển một sản phẩm về cơ bản là Super TES có ổ đĩa CD.{n}Đây sẽ là máy chơi game đầu tiên trên thế giới sử dụng ổ đĩa CD."
		}, {
			"value": "Journalists around the world are baffled as only one day after Vonny and Ninvento jointly announced the Play System at the Entertainment Conference things have turned sour.{n}Ninvento announced today that they will cancel the project and instead seek to develop a new console with a different partner.{n}Rumour has it that the distribution deal the companies had worked out was unfavorable to Ninvento handing over much of the control to Vonny.{n}This seems to be the end of the Play System.",
			"translation": "Các nhà báo trên toàn thế giới đang hoang mang vì chỉ một ngày sau khi Vonny và Ninvento cùng nhau công bố Play System tại Hội nghị Giải trí, mọi chuyện đã trở nên tồi tệ.{n}Ninvento hôm nay thông báo rằng họ sẽ hủy bỏ dự án và thay vào đó tìm cách phát triển một máy chơi game mới với một đối tác khác.{n}Có tin đồn rằng thỏa thuận phân phối mà các công ty đã đạt được không có lợi cho Ninvento khi giao quá nhiều quyền kiểm soát cho Vonny.{n}Đây dường như là dấu chấm hết cho Play System."
		}, {
			"value": "Today, Vonny has announced their very own console called the Playsystem. Apparently the company has completely reworked their earlier Play System prototype after Ninvento cancelled the project.{n}The new Playsystem comes with a CD-ROM drive and 32-bit processors and is wholly owned by Vonny. Industry professionals say that this might be the beginning of a new generation of consoles. Ninvento declined to comment. The Playsystem will enter the market {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Hôm nay, Vonny đã công bố máy chơi game của riêng họ có tên là Playsystem. Rõ ràng công ty đã hoàn toàn làm lại nguyên mẫu Play System trước đó của họ sau khi Ninvento hủy bỏ dự án.{n}Playsystem mới đi kèm với ổ đĩa CD-ROM và bộ xử lý 32-bit và hoàn toàn thuộc sở hữu của Vonny. Các chuyên gia trong ngành cho rằng đây có thể là sự khởi đầu của một thế hệ máy chơi game mới. Ninvento từ chối bình luận. Playsystem sẽ gia nhập thị trường {0}."
		}, {
			"value": "Ninvento announced their next generation console called TES 64 today. Expected {0} it is the world's first gaming console to sport 64-bit processors for graphics and audio. Ninvento said this will allow never-before-seen 3D realism.{n}In recent years the Super TES has lost a lot of market share to more modern consoles. Market experts said that the hardware of the TES 64 is surely impressive, but expressed their surprise that it still uses ROM cartridges instead of the much cheaper and higher capacity CD-ROM format.{n}Nevertheless, the TES 64 seems like an impressive console and Ninvento has said that it plans to aggressively price it against Vonny's Playsystem.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Ninvento hôm nay đã công bố máy chơi game thế hệ tiếp theo của họ có tên là TES 64. Dự kiến {0}, đây là máy chơi game đầu tiên trên thế giới sử dụng bộ xử lý 64-bit cho đồ họa và âm thanh. Ninvento cho biết điều này sẽ cho phép tạo ra độ chân thực 3D chưa từng thấy.{n}Trong những năm gần đây, Super TES đã mất rất nhiều thị phần vào tay các máy chơi game hiện đại hơn. Các chuyên gia thị trường cho biết phần cứng của TES 64 chắc chắn rất ấn tượng, nhưng bày tỏ sự ngạc nhiên rằng nó vẫn sử dụng băng ROM thay vì định dạng CD-ROM rẻ hơn nhiều và có dung lượng cao hơn.{n}Tuy nhiên, TES 64 có vẻ là một máy chơi game ấn tượng và Ninvento cho biết họ có kế hoạch định giá cạnh tranh mạnh mẽ với Playsystem của Vonny."
		}, {
			"value": "The day Vena fans have waited a long time for has arrived, as Vena has announced their next generation console, the DreamVast. A company spokesperson said, 'The DreamVast is a dream come true. This console is the most advanced gaming console in history!'.{n}The new console sports powerful graphics hardware promising graphic quality rivaling those on high-end PCs. The DreamVast is also the first console to ship with a modem out-of-the-box, making it ready for online play. The console will be available {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Ngày mà người hâm mộ Vena đã chờ đợi từ lâu đã đến, khi Vena công bố máy chơi game thế hệ tiếp theo của họ, DreamVast. Một phát ngôn viên của công ty cho biết, 'DreamVast là một giấc mơ trở thành hiện thực. Máy chơi game này là máy chơi game tiên tiến nhất trong lịch sử!'.{n}Máy chơi game mới này sở hữu phần cứng đồ họa mạnh mẽ hứa hẹn chất lượng đồ họa sánh ngang với các PC cao cấp. DreamVast cũng là máy chơi game đầu tiên được trang bị modem sẵn có, giúp nó sẵn sàng cho việc chơi trực tuyến. Máy chơi game sẽ có mặt trên thị trường {0}."
		}, {
			"value": "Today, Vonny has announced the much anticipated successor to their popular Playsystem console. The Playsystem 2 will have upgraded hardware to compete with newer generation consoles such as the DreamVast.{n}Unlike the DreamVast the Playsystem 2 does not focus much on online play but instead seems to focus on the strengths of the previous Playsystem. A solid upgraded controller including vibration function, upgraded graphics, support for DVD titles and even backwards compatibility with Playsystem 1 games.",
			"translation": "Hôm nay, Vonny đã công bố người kế nhiệm rất được mong đợi cho máy chơi game Playsystem nổi tiếng của họ. Playsystem 2 sẽ có phần cứng được nâng cấp để cạnh tranh với các máy chơi game thế hệ mới hơn như DreamVast.{n}Không giống như DreamVast, Playsystem 2 không tập trung nhiều vào chơi trực tuyến mà thay vào đó dường như tập trung vào thế mạnh của Playsystem trước đó. Một tay cầm điều khiển được nâng cấp chắc chắn bao gồm chức năng rung, đồ họa được nâng cấp, hỗ trợ các tựa game DVD và thậm chí cả khả năng tương thích ngược với các trò chơi Playsystem 1."
		}, {
			"value": "Since release, the DreamVast from Vena has been one of the fastest selling consoles in history but lately it seems that the anticipation of the upcoming Playsystem 2 release is slowing down sales.{n}If the Playsystem 2 can hold up to the hype when it is released then Vena could be in deep trouble.",
			"translation": "Kể từ khi phát hành, DreamVast của Vena là một trong những máy chơi game bán chạy nhất trong lịch sử nhưng gần đây có vẻ như sự mong đợi về việc phát hành Playsystem 2 sắp tới đang làm chậm doanh số bán hàng.{n}Nếu Playsystem 2 có thể đáp ứng được sự kỳ vọng khi nó được phát hành thì Vena có thể gặp rắc rối lớn."
		}, {
			"value": "PC software juggernaut Mirconoft has announced today that they will enter the game console market with their very own gaming console called the mBox.{n}First demonstrations have been impressive, but we will have to wait and see how it fares against the popular DreamVast, as well as against the recently announced and much anticipated Playsystem 2. The new console is said to debut {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Gã khổng lồ phần mềm PC Mirconoft hôm nay đã thông báo rằng họ sẽ tham gia thị trường máy chơi game với máy chơi game của riêng mình có tên là mBox.{n}Các buổi trình diễn đầu tiên rất ấn tượng, nhưng chúng ta sẽ phải chờ xem nó hoạt động như thế nào trước DreamVast nổi tiếng, cũng như trước Playsystem 2 mới được công bố gần đây và rất được mong đợi. Máy chơi game mới được cho là sẽ ra mắt {0}."
		}, {
			"value": "The launch of the Playsystem 2 has been a phenomenal success. Stores everywhere are out of stock as manufacturing can barely keep up. Fans have resorted to buying the console on internet auction sites for as much as five times the normal price.{n}While Vonny has managed to have the most successful launch in history, sales of Vena's DreamVast have plummeted.",
			"translation": "Sự ra mắt của Playsystem 2 là một thành công phi thường. Các cửa hàng ở khắp mọi nơi đều hết hàng vì sản xuất hầu như không thể theo kịp. Người hâm mộ đã phải mua máy chơi game trên các trang đấu giá trực tuyến với giá cao gấp năm lần giá bình thường.{n}Trong khi Vonny đã có màn ra mắt thành công nhất trong lịch sử, doanh số bán hàng của DreamVast của Vena đã giảm mạnh."
		}, {
			"value": "In a sobering announcement, Vena has today confirmed the discontinuation of the DreamVast. Vena's president said that while many companies will still deliver games for the platform, the company will no longer produce new units in the future.{n}Vena fans worldwide are disappointed, as a beloved part of gaming console history is coming to an end.",
			"translation": "Trong một thông báo đáng buồn, Vena hôm nay đã xác nhận việc ngừng sản xuất DreamVast. Chủ tịch của Vena cho biết mặc dù nhiều công ty vẫn sẽ cung cấp trò chơi cho nền tảng này, công ty sẽ không sản xuất các đơn vị mới trong tương lai nữa.{n}Người hâm mộ Vena trên toàn thế giới thất vọng, vì một phần yêu thích của lịch sử máy chơi game sắp kết thúc."
		}, {
			"value": "Today, Ninvento announced the new Ninvento Game Sphere, with which it will try to compete with Vonny's market leading Playsystem 2 and Mirconoft's strong alternative, the mBox. The curiously shaped console has similar hardware specifications as other consoles.{n}The Game Sphere is Ninvento's first console to have an optical disc drive instead of cartridges. However, instead of using full sized CD and DVDs, like its competitors, the console features a mini-DVD drive. Game Spheres will start rolling into stores {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Hôm nay, Ninvento đã công bố Ninvento Game Sphere mới, với sản phẩm này, họ sẽ cố gắng cạnh tranh với Playsystem 2 đang dẫn đầu thị trường của Vonny và giải pháp thay thế mạnh mẽ của Mirconoft, mBox. Máy chơi game có hình dạng kỳ lạ này có thông số kỹ thuật phần cứng tương tự như các máy chơi game khác.{n}Game Sphere là máy chơi game đầu tiên của Ninvento có ổ đĩa quang thay vì băng cạc-trít. Tuy nhiên, thay vì sử dụng đĩa CD và DVD kích thước đầy đủ như các đối thủ cạnh tranh, máy chơi game này lại có ổ đĩa mini-DVD. Game Spheres sẽ bắt đầu có mặt tại các cửa hàng {0}."
		}, {
			"value": "Rumours are spreading that Ninvento is working on a new game console. Most of the rumours state that it is not a successor to the somewhat disappointing Game Sphere but instead a new console in the mobile market.{n}Ninvento's Gameling has been leading the mobile market thanks to numerous updates and a large list of very popular games available on the platform, but the hardware is aging quickly and many players wonder what will be next.",
			"translation": "Tin đồn đang lan rộng rằng Ninvento đang phát triển một hệ máy chơi game mới. Hầu hết các tin đồn đều cho rằng đây không phải là người kế nhiệm của Game Sphere hơi đáng thất vọng mà là một hệ máy mới trên thị trường di động.{n}Gameling của Ninvento đã dẫn đầu thị trường di động nhờ nhiều bản cập nhật và danh sách lớn các trò chơi rất phổ biến có sẵn trên nền tảng này, nhưng phần cứng đang già đi nhanh chóng và nhiều người chơi tự hỏi điều gì sẽ xảy ra tiếp theo."
		}, {
			"value": "Today, Vonny announced that they are launching a new mobile gaming console called Portable Playsystem, or PPS for short, {0}. Media analysts speculate that this announcement is meant to distract users from Ninvento's launch of the Ninvento GS.{n}While the Ninvento GS utilizes an innovative dual screen, the PPS instead makes use of a single screen and will focus on giving developers access to much more powerful hardware.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Hôm nay, Vonny đã công bố rằng họ sẽ ra mắt một hệ máy chơi game di động mới có tên là Portable Playsystem, hay viết tắt là PPS, {0}. Các nhà phân tích truyền thông suy đoán rằng thông báo này nhằm đánh lạc hướng người dùng khỏi việc Ninvento ra mắt Ninvento GS.{n}Trong khi Ninvento GS sử dụng màn hình kép cải tiến, PPS lại sử dụng một màn hình duy nhất và sẽ tập trung vào việc cung cấp cho các nhà phát triển quyền truy cập vào phần cứng mạnh mẽ hơn nhiều."
		}, {
			"value": "Industry experts predict that we will see the next generation of video game consoles as early as next year. 'The hardware advancements in the PC industry have not been reflected in gaming consoles yet and we can expect the next generation to be a truly exciting leap forward.'{n}According to rumours, both Mirconoft and Vonny are in a race to introduce the next-generation console, with Mirconoft apparently already collaborating with partners to prepare titles for what is called the 'mBox 360.'",
			"translation": "Các chuyên gia trong ngành dự đoán rằng chúng ta sẽ thấy thế hệ máy chơi game tiếp theo sớm nhất là vào năm tới. 'Những tiến bộ về phần cứng trong ngành công nghiệp PC vẫn chưa được phản ánh trong các máy chơi game và chúng ta có thể kỳ vọng thế hệ tiếp theo sẽ là một bước nhảy vọt thực sự thú vị.'{n}Theo tin đồn, cả Mirconoft và Vonny đều đang chạy đua để giới thiệu hệ máy thế hệ tiếp theo, với Mirconoft dường như đã hợp tác với các đối tác để chuẩn bị các tựa game cho hệ máy được gọi là 'mBox 360.'"
		}, {
			"value": "Today, Mirconoft presented their new console called the mBox 360. It is the first in the next generation of expected consoles, and features hardware rivaling mid-end PC counterparts. With a relatively cheap purchase price, Mirconoft will be selling the device at a loss as part of a long-term strategy to gain market share.{n}Gamers around the world are excited by the new console and it is predicted that the mBox 360 will have a massive impact on the console market.",
			"translation": "Hôm nay, Mirconoft đã giới thiệu hệ máy mới của họ có tên là mBox 360. Đây là hệ máy đầu tiên trong thế hệ máy chơi game được mong đợi tiếp theo, và có phần cứng cạnh tranh với các máy PC tầm trung. Với mức giá mua tương đối rẻ, Mirconoft sẽ bán thiết bị này chịu lỗ như một phần của chiến lược dài hạn nhằm giành thị phần.{n}Các game thủ trên toàn thế giới rất hào hứng với hệ máy mới này và dự đoán rằng mBox 360 sẽ có tác động lớn đến thị trường console."
		}, {
			"value": "Today, Ninvento has announced their bid in the next-generation console market by announcing the Nuu. Instead of trying to compete with Mirconoft and Vonny on hardware strength and graphical power, Ninvento has decided to deliver a truly unique gaming experience.{n}The Nuu features a controller with a built-in motion sensor, which allows players to stand front of their TV and use the controller as a counterpart to virtual objects such as a tennis racquet.{n}First playtesters were seen with huge grins on their faces. It seems to be a lot of fun.",
			"translation": "Hôm nay, Ninvento đã công bố sự tham gia của họ vào thị trường console thế hệ tiếp theo bằng việc công bố Nuu. Thay vì cố gắng cạnh tranh với Mirconoft và Vonny về sức mạnh phần cứng và đồ họa, Ninvento đã quyết định mang đến một trải nghiệm chơi game thực sự độc đáo.{n}Nuu có một bộ điều khiển với cảm biến chuyển động tích hợp, cho phép người chơi đứng trước TV và sử dụng bộ điều khiển như một vật thể ảo tương ứng, chẳng hạn như vợt tennis.{n}Những người chơi thử nghiệm đầu tiên đều nở nụ cười toe toét. Có vẻ như nó rất vui."
		}, {
			"value": "Today, Vonny has announced the successor to the massively successful Playsystem 2. The new console is predictably called 'Playsystem 3' and comes with an impressive hardware configuration, making it the most powerful console in gaming history.{n}The console also doubles as a player for BlueRay, which Vonny hopes will be the successor to the DVD format. All this power comes with a hefty price tag, also making the Playsystem 3 the most expensive console ever.{n}We will see how consumers will react to this given the lower-cost alternatives; however, considering the massive success of the Playsystem 2, Vonny can be hopeful.\nThe console is expected to ship {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Hôm nay, Vonny đã công bố người kế nhiệm của Playsystem 2 cực kỳ thành công. Hệ máy mới này được dự đoán sẽ có tên là 'Playsystem 3' và đi kèm với cấu hình phần cứng ấn tượng, khiến nó trở thành hệ máy mạnh nhất trong lịch sử game.{n}Hệ máy này cũng có thể đóng vai trò như một đầu phát BlueRay, mà Vonny hy vọng sẽ là người kế nhiệm của định dạng DVD. Tất cả sức mạnh này đi kèm với một mức giá đắt đỏ, cũng khiến Playsystem 3 trở thành hệ máy đắt nhất từ trước đến nay.{n}Chúng ta sẽ xem người tiêu dùng phản ứng thế nào với điều này khi có các lựa chọn thay thế chi phí thấp hơn; tuy nhiên, xét đến thành công vang dội của Playsystem 2, Vonny có thể hy vọng.\nHệ máy dự kiến sẽ được xuất xưởng {0}."
		}, {
			"value": "In what some call a bizarre show of arrogance Vonny representatives have been trash-talking Mirconoft's successful mBox 360 while praising their own upcoming Playsystem 3 in the lead-up to their launch {0}.{n}Asked about the unusually high price of the Playsystem 3, a high-ranking company official replied, 'People will work more hours to buy one. We want people to feel that they want it more than anything else.'.{n}We are not sure that players will really want it so badly, as, so far, no major game titles have been announced for the Playsystem 3. It might be a while before developers are able to take full advantage of the powerful new console.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Trong một động thái mà một số người gọi là sự kiêu ngạo kỳ quái, đại diện của Vonny đã nói xấu mBox 360 thành công của Mirconoft trong khi ca ngợi Playsystem 3 sắp ra mắt của chính họ trước thềm buổi ra mắt {0}.{n}Khi được hỏi về mức giá cao bất thường của Playsystem 3, một quan chức cấp cao của công ty đã trả lời: 'Mọi người sẽ làm việc nhiều giờ hơn để mua một chiếc. Chúng tôi muốn mọi người cảm thấy rằng họ muốn nó hơn bất cứ thứ gì khác.'.{n}Chúng tôi không chắc liệu người chơi có thực sự muốn nó đến vậy không, vì cho đến nay, chưa có tựa game lớn nào được công bố cho Playsystem 3. Có thể sẽ mất một thời gian trước khi các nhà phát triển có thể tận dụng tối đa sức mạnh của hệ máy mới này."
		}, {
			"value": "Today, Grapple, a company well known for their role in the early PC industry and, more recently, for their portable music player, grPod, have announced that they will soon release a powerful new mobile phone. The phone has a touch screen and sports a surprisingly powerful CPU.{n}The integrated graphics chipset should also allow the phone to run games and, since the phone comes with its own application delivery platform, it could become a great device for mobile games. The grPhone will be available {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Hôm nay, Grapple, một công ty nổi tiếng với vai trò của họ trong ngành công nghiệp PC thời kỳ đầu và gần đây hơn là máy nghe nhạc di động grPod, đã thông báo rằng họ sẽ sớm phát hành một chiếc điện thoại di động mới mạnh mẽ. Chiếc điện thoại này có màn hình cảm ứng và sở hữu một CPU mạnh mẽ đáng ngạc nhiên.{n}Chipset đồ họa tích hợp cũng cho phép điện thoại chạy game và vì điện thoại đi kèm với nền tảng phân phối ứng dụng riêng, nó có thể trở thành một thiết bị tuyệt vời cho game di động. grPhone sẽ có mặt trên thị trường {0}."
		}, {
			"value": "Today, Grapple, the company responsible for the massively successful grPhone has announced their plans to release a tablet device called the grPad. Tablet devices are not a new idea in the computing industry but earlier attempts never seemed to take off. Many expect the grPad to do very well.",
			"translation": "Hôm nay, Grapple, công ty chịu trách nhiệm cho chiếc grPhone cực kỳ thành công, đã công bố kế hoạch phát hành một thiết bị máy tính bảng có tên là grPad. Máy tính bảng không phải là một ý tưởng mới trong ngành công nghiệp máy tính nhưng những nỗ lực trước đó dường như chưa bao giờ thành công. Nhiều người kỳ vọng grPad sẽ hoạt động rất tốt."
		}, {
			"value": "The mPad has received mixed reviews at launch, with many of them highlighting the fact that the mPad is indeed not the same as the grPad from Grapple. We will see what the future holds for this platform.",
			"translation": "mPad đã nhận được nhiều đánh giá trái chiều khi ra mắt, nhiều trong số đó nhấn mạnh thực tế rằng mPad thực sự không giống với grPad của Grapple. Chúng ta sẽ xem tương lai sẽ ra sao với nền tảng này."
		}, {
			"value": "For fans of the mBox, the long wait for an update to the console will soon be over as Mirconoft has announced that the mBox Next will be available {0}.",
			"comment": "{0} is date referal sentence fragment",
			"translation": "Đối với những người hâm mộ mBox, sự chờ đợi một bản cập nhật cho hệ máy này sẽ sớm kết thúc khi Mirconoft đã thông báo rằng mBox Next sẽ có mặt {0}."
		}, {
			"value": " Mirconoft has lost a substantial share of the market since {0} released their {1} console.{n}",
			"translation": " Mirconoft đã mất một phần đáng kể thị phần kể từ khi {0} phát hành hệ máy {1} của họ.{n}"
		}, {
			"value": "The new console seems to cleverly integrate Mirconoft's own motion sensor add-on for the mBox into one small package. The strength of the hardware seems to match expectations.",
			"translation": "Hệ máy mới dường như tích hợp một cách thông minh cảm biến chuyển động bổ trợ của Mirconoft cho mBox vào một gói nhỏ gọn. Sức mạnh của phần cứng có vẻ đáp ứng được kỳ vọng."
		}, {
			"value": " but we will see how well the new console competes with the popular {0} console.",
			"translation": " nhưng chúng ta sẽ xem hệ máy mới này cạnh tranh tốt như thế nào với hệ máy {0} phổ biến."
		}, {
			"value": " but we will see how the new console will fare against its competitors.",
			"translation": " nhưng chúng ta sẽ xem hệ máy mới này sẽ cạnh tranh như thế nào với các đối thủ của nó."
		}, {
			"value": "Dear {0}, we, the worldwide game developers guild, would like to invite you to a special award ceremony at our main meeting at the end of the year. Please come.\n\n(Hint: The game will end at the end of this year.)",
			"translation": "Kính gửi {0}, chúng tôi, hiệp hội các nhà phát triển game toàn cầu, xin trân trọng mời bạn tham dự một buổi lễ trao giải đặc biệt tại cuộc họp chính của chúng tôi vào cuối năm. Xin hãy đến.\n\n(Gợi ý: Trò chơi sẽ kết thúc vào cuối năm nay.)"
		}, {
			"value": "{0}, a newcomer in the game industry, has just released their first game '{1}'.\nThe game ",
			"comment": "fragment, continue with firstGameStoryRatingFragments",
			"translation": "{0}, một tân binh trong ngành công nghiệp game, vừa phát hành trò chơi đầu tiên của họ '{1}'.\nTrò chơi "
		}, {
			"value": "got generally low scores from reviewers but with a bit of experience we are sure that we will see better games from {0} in the future.",
			"comment": "firstGameStoryRatingFragments",
			"translation": "nhận được điểm số nhìn chung thấp từ các nhà phê bình nhưng với một chút kinh nghiệm, chúng tôi chắc chắn rằng chúng ta sẽ thấy những trò chơi tốt hơn từ {0} trong tương lai."
		}, {
			"value": "had a moderate response from reviewers. We are curious what {0} will deliver in the future.",
			"comment": "firstGameStoryRatingFragments",
			"translation": "nhận được phản hồi vừa phải từ các nhà phê bình. Chúng tôi rất tò mò xem {0} sẽ mang đến điều gì trong tương lai."
		}, {
			"value": "received favorable reviews. \nWith such a good start {0} are sure to gain fans quickly.",
			"comment": "firstGameStoryRatingFragments",
			"translation": "nhận được những đánh giá tích cực. \nVới một khởi đầu tốt như vậy, {0} chắc chắn sẽ nhanh chóng có được người hâm mộ."
		}, {
			"value": "outstanding",
			"translation": "xuất sắc"
		}, {
			"value": "great",
			"translation": "tuyệt vời"
		}, {
			"value": "moderate",
			"translation": "vừa phải"
		}, {
			"value": "below average",
			"translation": "dưới trung bình"
		}, {
			"value": "pretty bad",
			"translation": "khá tệ"
		}, {
			"value": "{0} has recently released a sequel to their game {1}. The newest game in the series titled {2} was met with {3} responses.",
			"translation": "{0} gần đây đã phát hành phần tiếp theo cho trò chơi {1} của họ. Trò chơi mới nhất trong sê-ri có tựa đề {2} đã nhận được phản hồi {3}."
		}, {
			"value": "Critics praised that {0} had a newer engine than the original, really driving technical innovation.",
			"translation": "Các nhà phê bình khen ngợi rằng {0} có một engine mới hơn bản gốc, thực sự thúc đẩy sự đổi mới kỹ thuật."
		}, {
			"value": "A major negative reaction came from fans who felt that with the original coming out just {0} weeks before, the company is trying to milk the franchise for more money without delivering much new for players to enjoy.",
			"translation": "Một phản ứng tiêu cực lớn đến từ người hâm mộ, những người cảm thấy rằng với việc bản gốc ra mắt chỉ {0} tuần trước đó, công ty đang cố gắng vắt kiệt thương hiệu để kiếm thêm tiền mà không mang lại nhiều điều mới mẻ cho người chơi thưởng thức."
		}, {
			"value": "Sequel",
			"translation": "Phần tiếp theo"
		}, {
			"value": "{0} has recently released an expansion pack to their game {1}. The expansion pack titled {2} was met with {3} responses.",
			"translation": "{0} gần đây đã phát hành một gói mở rộng cho trò chơi {1} của họ. Gói mở rộng có tựa đề {2} đã nhận được phản hồi {3}."
		}, {
			"value": "{n}A major negative reaction came from fans who felt that with the main game coming out just {0} weeks before, the company is trying to milk the franchise for more money without delivering much new for players to enjoy.",
			"translation": "{n}Một phản ứng tiêu cực lớn đến từ người hâm mộ, những người cảm thấy rằng với việc trò chơi chính ra mắt chỉ {0} tuần trước đó, công ty đang cố gắng vắt kiệt thương hiệu để kiếm thêm tiền mà không mang lại nhiều điều mới mẻ cho người chơi thưởng thức."
		}, {
			"value": "Expansion Pack",
			"translation": "Gói Mở rộng"
		}, {
			"value": "lite",
			"comment": "as in lite edition of the game",
			"translation": "rút gọn"
		}, {
			"value": "trial",
			"translation": "dùng thử"
		}, {
			"value": "{0} version",
			"comment": "could either be lite version or trial version",
			"translation": "phiên bản {0}"
		}, {
			"value": "Welcome",
			"comment": "heading to greet the player",
			"translation": "Chào mừng"
		}, {
			"value": "good",
			"translation": "tốt"
		}, {
			"value": "It seems that the initial sales for {0} have fallen way below expected numbers. The game received {1} reviews but it seems that the chosen platform isn't very popular with the target audience.",
			"comment": "{1} is adjective like good, moderate, outstanding",
			"translation": "Có vẻ như doanh số ban đầu của {0} đã giảm mạnh so với con số dự kiến. Trò chơi nhận được {1} đánh giá nhưng có vẻ như nền tảng được chọn không thực sự phổ biến với đối tượng mục tiêu."
		}, {
			"value": "Sales Report",
			"translation": "Báo cáo Doanh thu"
		}, {
			"value": "The latest game by {0} has had reviewers scratching their heads. Rather than bringing a new and innovative game to market the company delivered another {1}/{2} game which is more or less the same setting as their previous game.{n}One reviewer commented:'I think {3} was simply developed too soon after the previous game with not enough innovations in technology and design.'",
			"translation": "Trò chơi mới nhất của {0} đã khiến các nhà phê bình phải vò đầu bứt tai. Thay vì mang đến một trò chơi mới lạ và sáng tạo cho thị trường, công ty lại tung ra một trò chơi {1}/{2 khác, ít nhiều giống hệt bối cảnh của trò chơi trước đó của họ.{n}Một nhà phê bình nhận xét: 'Tôi nghĩ {3} đơn giản là được phát triển quá sớm sau trò chơi trước đó mà không có đủ sự đổi mới về công nghệ và thiết kế.'"
		}, {
			"value": "Media Report",
			"translation": "Báo cáo Truyền thông"
		}, {
			"value": "Welcome to your new office!\nNow that you have a bigger office you can also hire staff and forge a world-class development team to make even better games.",
			"translation": "Chào mừng đến văn phòng mới của bạn!\nGiờ đây bạn đã có một văn phòng lớn hơn, bạn cũng có thể thuê nhân viên và xây dựng một đội ngũ phát triển đẳng cấp thế giới để tạo ra những trò chơi thậm chí còn tốt hơn."
		}, {
			"value": "and",
			"translation": "và"
		}, {
			"value": "Welcome to the new headquarters of {0}!\nWe now have more space so you can increase the team further. The new office is also close to some renowned universities which gives us great access to new talent.",
			"translation": "Chào mừng đến trụ sở mới của {0}!\nGiờ đây chúng ta có nhiều không gian hơn để bạn có thể mở rộng đội ngũ hơn nữa. Văn phòng mới cũng gần một số trường đại học danh tiếng, điều này giúp chúng ta có cơ hội tiếp cận nguồn nhân tài mới tuyệt vời."
		}, {
			"value": "Wow, this new office is amazing and the location is perfect too. I took a walk around the building earlier and had this radical idea.\nWhy don't we open up our own research and development department?{n}This could really speed up our research and would allow us to attack bigger projects and innovations.\nIt wouldn't be cheap but I think it would allow us to be the leading innovator in the gaming industry.{n}Anyway, I have done some research and I think we should open a lab and hire a whole team of researchers. Before we can do this however, we should have at least one design specialist in our team.",
			"translation": "Chà, văn phòng mới này thật tuyệt vời và vị trí cũng hoàn hảo nữa. Lúc nãy tôi đi dạo quanh tòa nhà và nảy ra ý tưởng táo bạo này.\nTại sao chúng ta không mở một bộ phận nghiên cứu và phát triển (R&D) của riêng mình nhỉ?{n}Điều này thực sự có thể đẩy nhanh quá trình nghiên cứu của chúng ta và cho phép chúng ta thực hiện các dự án lớn hơn và những đổi mới đột phá.\nSẽ không rẻ đâu nhưng tôi nghĩ nó sẽ cho phép chúng ta trở thành nhà đổi mới hàng đầu trong ngành công nghiệp game.{n}Dù sao thì, tôi đã nghiên cứu một chút và tôi nghĩ chúng ta nên mở một phòng thí nghiệm và thuê cả một đội ngũ nhà nghiên cứu. Tuy nhiên, trước khi làm điều đó, chúng ta cần có ít nhất một chuyên gia thiết kế trong đội của mình."
		}, {
			"value": "Hello {0},\nWe have just learned that you have opened your new headquarters not too far away from our university! We are just about to start a special course about game development and could really use your help.{n}Unfortunately we cannot offer any pay but I think you will find that teaching students about game development will be a great exercise to refine your own skills.\n{1} University{n}New training options available.",
			"translation": "Chào {0},\nChúng tôi vừa biết rằng bạn đã mở trụ sở mới không xa trường đại học của chúng tôi! Chúng tôi sắp bắt đầu một khóa học đặc biệt về phát triển game và rất cần sự giúp đỡ của bạn.{n}Thật không may, chúng tôi không thể trả lương nhưng tôi nghĩ bạn sẽ thấy rằng việc dạy sinh viên về phát triển game sẽ là một bài tập tuyệt vời để trau dồi kỹ năng của chính bạn.\nĐại học {1}{n}Các tùy chọn đào tạo mới đã có."
		}, {
			"value": "Welcome to our very own research and development lab! At the moment it is empty but we have a number of skilled people eager to start working.{n}You don't have to hire them individually, instead you can simply decide on the budget for the R&D lab. The higher the budget, the more researchers will work and the higher the research progress will be.{n}Running your own R&D lab can be very expensive so be careful that you don't overspend. I suggest you start with smaller projects and don't be afraid to cut down the budget if necessary.{n}If there is no active project researchers will generate research points slowly, which you can use to train your main staff and unlock more game options.",
			"translation": "Chào mừng đến với phòng thí nghiệm nghiên cứu và phát triển của riêng chúng ta! Hiện tại nó trống rỗng nhưng chúng ta có một số người tài năng sẵn sàng bắt đầu làm việc.{n}Bạn không cần phải thuê họ riêng lẻ, thay vào đó bạn chỉ cần quyết định ngân sách cho phòng R&D. Ngân sách càng cao, càng có nhiều nhà nghiên cứu làm việc và tiến độ nghiên cứu sẽ càng cao.{n}Vận hành phòng R&D của riêng bạn có thể rất tốn kém vì vậy hãy cẩn thận đừng chi tiêu quá mức. Tôi đề nghị bạn bắt đầu với các dự án nhỏ hơn và đừng ngại cắt giảm ngân sách nếu cần thiết.{n}Nếu không có dự án nào đang hoạt động, các nhà nghiên cứu sẽ tạo ra điểm nghiên cứu một cách từ từ, bạn có thể sử dụng chúng để đào tạo nhân viên chính của mình và mở khóa thêm các tùy chọn trò chơi."
		}, {
			"value": "Welcome to our very own hardware lab! This is the place where we will create our own game console. Before you start, make sure you have a lot of cash saved up. Building a console isn't cheap. When you are ready to start simply {0} on the screen to access the action menu.",
			"translation": "Chào mừng đến với phòng thí nghiệm phần cứng của riêng chúng ta! Đây là nơi chúng ta sẽ tạo ra hệ máy chơi game của riêng mình. Trước khi bắt đầu, hãy đảm bảo bạn đã tiết kiệm đủ tiền mặt. Xây dựng một hệ máy không hề rẻ. Khi bạn sẵn sàng bắt đầu, chỉ cần {0} vào màn hình để truy cập menu hành động."
		}, {
			"value": "We just got word that {0} is retiring its MMO game {1} from the market. The game has been on the market for {2} months and racked up over {3} in sales.",
			"translation": "Chúng tôi vừa nhận được tin {0} sẽ ngừng phát hành trò chơi MMO {1} của họ. Trò chơi đã có mặt trên thị trường được {2} tháng và đạt doanh thu hơn {3}."
		}, {
			"value": "{1} was likely not profitable anymore as the maintenance costs were likely larger than the income.",
			"translation": "{1} có lẽ không còn mang lại lợi nhuận nữa vì chi phí bảo trì có thể đã lớn hơn doanh thu."
		}, {
			"value": "We are not quite sure why {0} has decided to take {1} off the market as the game likely still generated income for the company.",
			"translation": "Chúng tôi không hoàn toàn chắc chắn tại sao {0} lại quyết định ngừng phát hành {1} vì trò chơi này có lẽ vẫn đang tạo ra thu nhập cho công ty."
		}, {
			"value": "While fans of {0} weren't happy about the news many of them also play {1} which is still on the market.",
			"translation": "Mặc dù người hâm mộ của {0} không vui về tin tức này, nhiều người trong số họ cũng chơi {1} vẫn còn đang được phát hành trên thị trường."
		}, {
			"value": "Fans of {1} have voiced complaints with one fan saying: 'I love {0} and played {1} a lot but now that they took it off the market I don't know what MMO I should play. If only {0} had released a new MMO I wouldn't be so upset.'",
			"translation": "Người hâm mộ của {1} đã lên tiếng phàn nàn, một người hâm mộ nói: 'Tôi yêu {0} và đã chơi {1} rất nhiều nhưng bây giờ họ ngừng phát hành nó, tôi không biết nên chơi MMO nào nữa. Giá như {0} phát hành một MMO mới thì tôi đã không buồn như vậy.'"
		}, {
			"value": "{0} has released their game console {1} today.",
			"translation": "{0} đã phát hành hệ máy chơi game {1} của họ hôm nay."
		}, {
			"value": "The console seems to really push the limits of technology and is the most modern console ever to hit shelves.",
			"translation": "Hệ máy này dường như thực sự vượt qua giới hạn của công nghệ và là hệ máy hiện đại nhất từng được tung ra thị trường."
		}, {
			"value": "The console does not seem quite on par with the high tech competitors but we will see what players think.",
			"translation": "Hệ máy này có vẻ không hoàn toàn ngang bằng với các đối thủ cạnh tranh công nghệ cao nhưng chúng ta sẽ xem người chơi nghĩ gì."
		}, {
			"value": " Looking at the features of {0}, it seems that the ",
			"translation": " Nhìn vào các tính năng của {0}, có vẻ như "
		}, {
			"value": "list is extensive which is a good sign and could lead to a wide variety of games becoming available.",
			"translation": "danh sách rất phong phú, đó là một dấu hiệu tốt và có thể dẫn đến sự ra đời của nhiều loại trò chơi khác nhau."
		}, {
			"value": "list is a bit slim. Don't expect too many gadgets and controllers to be available for this console.",
			"translation": "danh sách hơi ít. Đừng mong đợi quá nhiều tiện ích và bộ điều khiển có sẵn cho hệ máy này."
		}, {
			"value": "First tests indicate that {0}",
			"translation": "Các thử nghiệm ban đầu cho thấy {0}"
		}, {
			"value": "'s build quality is excellent and will likely run for decades without issues.",
			"translation": " có chất lượng hoàn thiện xuất sắc và có khả năng sẽ hoạt động trong nhiều thập kỷ mà không gặp sự cố."
		}, {
			"value": "is of average build quality. Don't expect it to last forever but in general you should not see many issues.",
			"translation": "có chất lượng hoàn thiện ở mức trung bình. Đừng mong đợi nó sẽ tồn tại mãi mãi nhưng nhìn chung bạn sẽ không gặp nhiều vấn đề."
		}, {
			"value": "is a bit fragile. We wouldn't be surprised if you need to make use of the warranty sooner or later.",
			"translation": "hơi dễ vỡ. Chúng tôi sẽ không ngạc nhiên nếu bạn sớm hay muộn cũng cần đến bảo hành."
		}, {
			"value": "All in all ",
			"comment": "fragment continues with 'we think that the console...'",
			"translation": "Nói chung "
		}, {
			"value": "we think that the console will stir up the market and prove to be very successful.",
			"comment": "fragment, started with 'All in all'",
			"translation": "chúng tôi nghĩ rằng hệ máy này sẽ khuấy động thị trường và chứng tỏ rất thành công."
		}, {
			"value": "we think that the console will do reasonably well in the market and it is a welcome addition.",
			"comment": "fragment, started with 'All in all'",
			"translation": "chúng tôi nghĩ rằng hệ máy này sẽ hoạt động tương đối tốt trên thị trường và là một sự bổ sung đáng hoan nghênh."
		}, {
			"value": "it's hard to say whether the console will do well as there are so many other good products on the market.",
			"comment": "fragment, started with 'All in all'",
			"translation": "thật khó để nói liệu hệ máy này có thành công hay không vì có rất nhiều sản phẩm tốt khác trên thị trường."
		}, {
			"value": "first",
			"translation": "đầu tiên"
		}, {
			"value": "second",
			"translation": "thứ hai"
		}, {
			"value": "third",
			"translation": "thứ ba"
		}, {
			"value": "{0} has taken their game console {1} off the market.\n{1} was the {2} console created by the company.",
			"translation": "{0} đã ngừng bán hệ máy chơi game {1} của họ.\n{1} là hệ máy {2} do công ty tạo ra."
		}, {
			"value": " They are also known for their console {0} which has done very well on the market.",
			"translation": " Họ cũng được biết đến với hệ máy {0} đã hoạt động rất tốt trên thị trường."
		}, {
			"value": "Game finished",
			"translation": "Trò chơi kết thúc"
		}, {
			"value": "Congratulations. You have finished Game Dev Tycoon. We will now calculate your final score and show you some statistics. You may continue playing after that.",
			"translation": "Chúc mừng. Bạn đã hoàn thành Game Dev Tycoon. Bây giờ chúng tôi sẽ tính điểm cuối cùng của bạn và hiển thị một số thống kê. Bạn có thể tiếp tục chơi sau đó."
		}, {
			"value": "Goal reached",
			"comment": "heading",
			"translation": "Đạt mục tiêu"
		}, {
			"value": "You now have more than {0} fans! With such a big fan base you should now be able to self-publish medium games.",
			"translation": "Bạn hiện có hơn {0} người hâm mộ! Với một lượng fan lớn như vậy, giờ đây bạn có thể tự phát hành các trò chơi cỡ vừa."
		}, {
			"value": "You now have more than {0} fans! With such a big fan base you should now be able to self-publish large games.",
			"translation": "Bạn hiện có hơn {0} người hâm mộ! Với một lượng fan lớn như vậy, giờ đây bạn có thể tự phát hành các trò chơi cỡ lớn."
		}, {
			"value": "Game Convention",
			"translation": "Hội nghị Game"
		}, {
			"value": "Dear {0},\nWe have followed your progress in recent years and would like to extend this formal invitation to participate in the biggest game convention on the planet 'Games, Games, Games' also known as G3.{n}By having your own company booth at G3 you can gain a lot of fans and hype for your games and we think our audience would love to see you there.\nWe will contact you yearly with booth options. Hope to see you at G3.\nThe G3 committee.",
			"translation": "Kính gửi {0},\nChúng tôi đã theo dõi sự tiến bộ của bạn trong những năm gần đây và muốn gửi lời mời chính thức này để bạn tham gia hội nghị game lớn nhất hành tinh 'Games, Games, Games' còn được gọi là G3.{n}Bằng cách có gian hàng công ty của riêng bạn tại G3, bạn có thể thu hút rất nhiều người hâm mộ và tạo sự chú ý cho các trò chơi của mình và chúng tôi nghĩ rằng khán giả của chúng tôi sẽ rất muốn gặp bạn ở đó.\nChúng tôi sẽ liên hệ với bạn hàng năm về các lựa chọn gian hàng. Mong sớm gặp lại bạn tại G3.\nỦy ban G3."
		}, {
			"value": "Goal Hint",
			"comment": "heading",
			"translation": "Gợi ý Mục tiêu"
		}, {
			"value": "If you have more than 1M in cash you will be able to move to the next level. This might sound a lot but don't worry. Once you release a hit game you will get to this amount easily.",
			"translation": "Nếu bạn có hơn 1 triệu tiền mặt, bạn sẽ có thể lên cấp độ tiếp theo. Nghe có vẻ nhiều nhưng đừng lo lắng. Một khi bạn phát hành một trò chơi thành công, bạn sẽ dễ dàng đạt được số tiền này."
		}, {
			"value": "Engine Reminder",
			"comment": "heading",
			"translation": "Nhắc nhở về Engine"
		}, {
			"value": "Don't forget creating custom game engines. This will improve your games a lot! You can create your custom engine through the action menu once you have researched the Custom Engine.",
			"translation": "Đừng quên tạo các engine game tùy chỉnh. Điều này sẽ cải thiện trò chơi của bạn rất nhiều! Bạn có thể tạo engine tùy chỉnh của mình thông qua menu hành động sau khi đã nghiên cứu Custom Engine."
		}, {
			"value": "Hi {0},\nI have followed the progress of {1} for a while and it seems that with your recent expansion you have started developing larger games.\nLarger games deserve to be seen by more people and this is where a publisher can come in handy.{n}A publisher will market and publish your game around the world. They will also help fund development. In return they keep most of the profits but since the game will sell a lot more it is usually still worth it.{n}I can put you in touch with some publishers so you can look at some of the available contracts. Just let me know.\nJasmine Droke{n}Find Publishing Contract has been unlocked. It is accessible in the action menu.",
			"translation": "Chào {0},\nTôi đã theo dõi tiến độ của {1} một thời gian và có vẻ như với sự mở rộng gần đây, bạn đã bắt đầu phát triển các trò chơi lớn hơn.\nCác trò chơi lớn hơn xứng đáng được nhiều người biết đến hơn và đây là lúc một nhà phát hành có thể hữu ích.{n}Một nhà phát hành sẽ tiếp thị và phát hành trò chơi của bạn trên toàn thế giới. Họ cũng sẽ giúp tài trợ cho việc phát triển. Đổi lại, họ giữ phần lớn lợi nhuận nhưng vì trò chơi sẽ bán được nhiều hơn nên thường vẫn đáng giá.{n}Tôi có thể giới thiệu bạn với một số nhà phát hành để bạn có thể xem xét một số hợp đồng hiện có. Cứ cho tôi biết nhé.\nJasmine Droke{n}Tìm Hợp đồng Phát hành đã được mở khóa. Bạn có thể truy cập nó trong menu hành động."
		}, {
			"value": "Publishing Contracts",
			"comment": "heading",
			"translation": "Hợp đồng Phát hành"
		}, {
			"value": "Engine",
			"translation": "Engine"
		}, {
			"value": "Gameplay",
			"translation": "Lối chơi"
		}, {
			"value": "Story/Quests",
			"translation": "Cốt truyện/Nhiệm vụ"
		}, {
			"value": "Dialogues",
			"translation": "Hội thoại"
		}, {
			"value": "Level Design",
			"translation": "Thiết kế Màn chơi"
		}, {
			"value": "Artificial Intelligence",
			"translation": "Trí tuệ Nhân tạo"
		}, {
			"value": "World Design",
			"translation": "Thiết kế Thế giới"
		}, {
			"value": "Sound",
			"translation": "Âm thanh"
		}, {
			"value": "Advertise in magazines",
			"translation": "Quảng cáo trên tạp chí"
		}, {
			"value": "Magazines",
			"comment": "short name",
			"translation": "Tạp chí"
		}, {
			"value": "Advertise in gaming magazines to get the game well known before it hits the shelves.",
			"translation": "Quảng cáo trên các tạp chí game để trò chơi được biết đến rộng rãi trước khi lên kệ."
		}, {
			"value": "Magazines & Demos",
			"translation": "Tạp chí & Demo"
		}, {
			"value": "Advertise in gaming magazines and distribute demos of the game to give players an opportunity to try the game.",
			"translation": "Quảng cáo trên các tạp chí game và phân phát các bản demo của trò chơi để người chơi có cơ hội thử nghiệm."
		}, {
			"value": "Small Marketing Campaign",
			"translation": "Chiến dịch Marketing Nhỏ"
		}, {
			"value": "Small Campaign",
			"comment": "short name",
			"translation": "Chiến dịch Nhỏ"
		}, {
			"value": "Start a global marketing campaign including magazine ads, demos and interviews.",
			"translation": "Bắt đầu một chiến dịch marketing toàn cầu bao gồm quảng cáo trên tạp chí, demo và phỏng vấn."
		}, {
			"value": "Large Marketing Campaign",
			"translation": "Chiến dịch Marketing Lớn"
		}, {
			"value": "Large Campaign",
			"comment": "short name",
			"translation": "Chiến dịch Lớn"
		}, {
			"value": "Start a global marketing campaign to promote the game far and wide. Organize exclusive reviews, behind the scenes reports, TV trailers and more.",
			"translation": "Bắt đầu một chiến dịch marketing toàn cầu để quảng bá trò chơi rộng rãi. Tổ chức các bài đánh giá độc quyền, báo cáo hậu trường, trailer TV và hơn thế nữa."
		}, {
			"value": "Logo Animation",
			"comment": "heading",
			"translation": "Hoạt ảnh Logo"
		}, {
			"value": "Create an animation for an existing logo.",
			"translation": "Tạo một hoạt ảnh cho một logo hiện có."
		}, {
			"value": "Character Design",
			"comment": "heading",
			"translation": "Thiết kế Nhân vật"
		}, {
			"value": "Design some game characters.",
			"translation": "Thiết kế một số nhân vật game."
		}, {
			"value": "Playtest",
			"comment": "heading",
			"translation": "Chơi thử"
		}, {
			"value": "Help to playtest a game.",
			"translation": "Giúp chơi thử một trò chơi."
		}, {
			"value": "Game Backdrops",
			"comment": "heading",
			"translation": "Hình nền Game"
		}, {
			"value": "Design some simple background graphics for a game.",
			"translation": "Thiết kế một số đồ họa nền đơn giản cho một trò chơi."
		}, {
			"value": "Setup Computers",
			"comment": "heading",
			"translation": "Thiết lập Máy tính"
		}, {
			"value": "Install Mirconoft BOSS on computers",
			"translation": "Cài đặt Mirconoft BOSS trên máy tính"
		}, {
			"value": "Debug program",
			"comment": "heading",
			"translation": "Gỡ lỗi chương trình"
		}, {
			"value": "Spritesheet Software",
			"comment": "heading",
			"translation": "Phần mềm Spritesheet"
		}, {
			"value": "Our staff needs to be taught how to use these modern technologies.",
			"translation": "Nhân viên của chúng ta cần được đào tạo cách sử dụng các công nghệ hiện đại này."
		}, {
			"value": "Library Software",
			"comment": "heading",
			"translation": "Phần mềm Thư viện"
		}, {
			"value": "Develop a simple library management system",
			"translation": "Phát triển một hệ thống quản lý thư viện đơn giản"
		}, {
			"value": "Usability Study",
			"comment": "heading",
			"translation": "Nghiên cứu Khả năng sử dụng"
		}, {
			"value": "Perform a detailed usability study.",
			"translation": "Thực hiện một nghiên cứu chi tiết về khả năng sử dụng."
		}, {
			"value": "Review Game Concept",
			"comment": "heading",
			"translation": "Đánh giá Ý tưởng Game"
		}, {
			"value": "Review a game concept using your expertise.",
			"translation": "Đánh giá một ý tưởng game bằng chuyên môn của bạn."
		}, {
			"value": "Game Art",
			"comment": "heading",
			"translation": "Đồ họa Game"
		}, {
			"value": "Help out on a project with some game art",
			"translation": "Giúp đỡ một dự án bằng một số đồ họa game"
		}, {
			"value": "Clean up database",
			"comment": "heading",
			"translation": "Dọn dẹp cơ sở dữ liệu"
		}, {
			"value": "Should one table really have 200 columns? Probably not.",
			"translation": "Một bảng có thực sự nên có 200 cột không? Có lẽ là không."
		}, {
			"value": "Accounting Software",
			"comment": "heading",
			"translation": "Phần mềm Kế toán"
		}, {
			"value": "Develop a simple accounting software. Are those ever simple?",
			"translation": "Phát triển một phần mềm kế toán đơn giản. Chúng có bao giờ đơn giản không nhỉ?"
		}, {
			"value": "Time Tracking",
			"comment": "heading",
			"translation": "Theo dõi Thời gian"
		}, {
			"value": "Design and develop a time tracking system.",
			"translation": "Thiết kế và phát triển một hệ thống theo dõi thời gian."
		}, {
			"value": "Design a board game",
			"comment": "heading",
			"translation": "Thiết kế một trò chơi cờ bàn"
		}, {
			"value": "Let's see how your skills translate to traditional games.",
			"translation": "Hãy xem kỹ năng của bạn áp dụng vào các trò chơi truyền thống như thế nào."
		}, {
			"value": "Horoscope Generator",
			"comment": "heading",
			"translation": "Trình tạo Tử vi"
		}, {
			"value": "Making up horoscopes is hard work. We want it automated.",
			"translation": "Việc tạo ra các lá số tử vi rất tốn công. Chúng tôi muốn tự động hóa nó."
		}, {
			"value": "Character Dialogues",
			"comment": "heading",
			"translation": "Hội thoại Nhân vật"
		}, {
			"value": "Improve our character dialogues.",
			"translation": "Cải thiện hội thoại nhân vật của chúng ta."
		}, {
			"value": "Futuristic Application",
			"comment": "heading",
			"translation": "Ứng dụng Tương lai"
		}, {
			"value": "We need an application that looks futuristic for a movie.",
			"translation": "Chúng tôi cần một ứng dụng trông có vẻ tương lai cho một bộ phim."
		}, {
			"value": "Vacuum Robot",
			"comment": "heading",
			"translation": "Robot Hút bụi"
		}, {
			"value": "Create a revolutionary AI for a vacuum robot",
			"translation": "Tạo ra một AI mang tính cách mạng cho robot hút bụi"
		}, {
			"value": "Website",
			"comment": "heading",
			"translation": "Trang web"
		}, {
			"value": "We just heard of this thing called internet. We want to have one.",
			"translation": "Chúng tôi vừa nghe nói về thứ gọi là internet. Chúng tôi muốn có một cái."
		}, {
			"value": "Game Port",
			"comment": "heading",
			"translation": "Chuyển hệ Game"
		}, {
			"value": "Port a game to a different platform.",
			"translation": "Chuyển một trò chơi sang một nền tảng khác."
		}, {
			"value": "Cut Scenes",
			"comment": "heading",
			"translation": "Cảnh cắt"
		}, {
			"value": "Deliver professional cut scenes for a game.",
			"translation": "Tạo ra các cảnh cắt chuyên nghiệp cho một trò chơi."
		}, {
			"value": "Space Shuttle",
			"comment": "heading",
			"translation": "Tàu con thoi"
		}, {
			"value": "Deliver part of the space shuttle control software.",
			"translation": "Cung cấp một phần của phần mềm điều khiển tàu con thoi."
		}, {
			"value": "Alien Search",
			"comment": "heading",
			"translation": "Tìm kiếm Người ngoài hành tinh"
		}, {
			"value": "Optimize our search for alien life forms using advanced AI techniques.",
			"translation": "Tối ưu hóa việc tìm kiếm các dạng sống ngoài hành tinh của chúng ta bằng các kỹ thuật AI tiên tiến."
		}, {
			"value": "Movies",
			"comment": "heading",
			"translation": "Phim ảnh"
		}, {
			"value": "We need your skills in our latest blockbuster production.",
			"translation": "Chúng tôi cần kỹ năng của bạn trong dự án bom tấn mới nhất của mình."
		}, {
			"value": "Thank you for taking care of this for us.",
			"translation": "Cảm ơn bạn đã lo liệu việc này cho chúng tôi."
		}, {
			"value": "Well done.",
			"translation": "Làm tốt lắm."
		}, {
			"value": "Just what we wanted.",
			"translation": "Đúng thứ chúng tôi muốn."
		}, {
			"value": "Excellent work.",
			"translation": "Công việc xuất sắc."
		}, {
			"value": "Thank you for the quick work.",
			"translation": "Cảm ơn bạn đã làm việc nhanh chóng."
		}, {
			"value": "Would hire again.",
			"translation": "Sẽ thuê lại."
		}, {
			"value": "Nice job.",
			"translation": "Làm tốt lắm."
		}, {
			"value": "Success!",
			"translation": "Thành công!"
		}, {
			"value": "Contract Successful",
			"comment": "heading",
			"translation": "Hợp đồng Thành công"
		}, {
			"value": "We will transfer {0} to your account.",
			"translation": "Chúng tôi sẽ chuyển {0} vào tài khoản của bạn."
		}, {
			"value": "contract payment",
			"comment": "heading",
			"translation": "thanh toán hợp đồng"
		}, {
			"value": "This is very disappointing.",
			"translation": "Điều này thật đáng thất vọng."
		}, {
			"value": "You didn't complete the contract on time",
			"translation": "Bạn đã không hoàn thành hợp đồng đúng hạn"
		}, {
			"value": "Hope you can make it next time.",
			"translation": "Hy vọng lần sau bạn có thể làm được."
		}, {
			"value": "Seems like this was too big of a job for you.",
			"translation": "Có vẻ như công việc này quá sức với bạn."
		}, {
			"value": "Unfortunately the deadline is here.",
			"translation": "Thật không may, đã đến hạn chót."
		}, {
			"value": "Contract Failed",
			"comment": "heading",
			"translation": "Hợp đồng Thất bại"
		}, {
			"value": "A penalty of {0} will be applied to your account.",
			"translation": "Một khoản phạt {0} sẽ được áp dụng vào tài khoản của bạn."
		}, {
			"value": "contract penalty",
			"comment": "heading",
			"translation": "phạt hợp đồng"
		}, {
			"value": "The game meets the required ratings. We are looking forward to future business.",
			"translation": "Trò chơi đáp ứng các đánh giá yêu cầu. Chúng tôi mong muốn hợp tác trong tương lai."
		}, {
			"value": "The game doesn't live up to expectations.\nAs per contract a penalty will be applied to your account.",
			"translation": "Trò chơi không đáp ứng được kỳ vọng.\nTheo hợp đồng, một khoản phạt sẽ được áp dụng vào tài khoản của bạn."
		}, {
			"value": "Publisher",
			"comment": "heading",
			"translation": "Nhà phát hành"
		}, {
			"value": "Any Topic",
			"translation": "Bất kỳ Chủ đề nào"
		}, {
			"value": "Any Genre",
			"translation": "Bất kỳ Thể loại nào"
		}, {
			"value": "Publisher: {0}",
			"translation": "Nhà phát hành: {0}"
		}, {
			"value": "General",
			"translation": "Chung"
		}, {
			"value": "New research available:",
			"translation": "Nghiên cứu mới có sẵn:"
		}, {
			"value": "New Research!",
			"comment": "heading",
			"translation": "Nghiên cứu Mới!"
		}, {
			"value": "Text based",
			"translation": "Dạng văn bản"
		}, {
			"value": "2D Graphics V{0}",
			"translation": "Đồ họa 2D V{0}"
		}, {
			"value": "3D Graphics V{0}",
			"translation": "Đồ họa 3D V{0}"
		}, {
			"value": "Basic sounds",
			"translation": "Âm thanh cơ bản"
		}, {
			"value": "Mono sound",
			"translation": "Âm thanh Mono"
		}, {
			"value": "Stereo sound",
			"translation": "Âm thanh Stereo"
		}, {
			"value": "Soundtrack",
			"translation": "Nhạc nền"
		}, {
			"value": "Surround sound",
			"translation": "Âm thanh vòm"
		}, {
			"value": "Orchestral soundtrack",
			"translation": "Nhạc nền giao hưởng"
		}, {
			"value": "A.I.",
			"translation": "A.I."
		}, {
			"value": "Better A.I.",
			"translation": "A.I. Tốt hơn"
		}, {
			"value": "A.I. Companions",
			"translation": "Bạn đồng hành A.I."
		}, {
			"value": "Self-learning A.I.",
			"translation": "A.I. tự học"
		}, {
			"value": "Achievements",
			"translation": "Thành tựu"
		}, {
			"value": "Character progression",
			"translation": "Tiến triển nhân vật"
		}, {
			"value": "Skill trees",
			"translation": "Cây kỹ năng"
		}, {
			"value": "Savegame",
			"translation": "Lưu game"
		}, {
			"value": "Multiplayer",
			"translation": "Chơi nhiều người"
		}, {
			"value": "Video playback",
			"translation": "Phát lại video"
		}, {
			"value": "Basic physics",
			"translation": "Vật lý cơ bản"
		}, {
			"value": "Mod support",
			"translation": "Hỗ trợ mod"
		}, {
			"value": "Online play",
			"translation": "Chơi trực tuyến"
		}, {
			"value": "Save to cloud",
			"translation": "Lưu lên đám mây"
		}, {
			"value": "MMO Support",
			"translation": "Hỗ trợ MMO"
		}, {
			"value": "Software Development Kit",
			"translation": "Bộ Công cụ Phát triển Phần mềm"
		}, {
			"value": "Linear story",
			"translation": "Cốt truyện tuyến tính"
		}, {
			"value": "Simple cutscenes",
			"translation": "Cảnh cắt đơn giản"
		}, {
			"value": "Branching story",
			"translation": "Cốt truyện phân nhánh"
		}, {
			"value": "Advanced cutscenes",
			"translation": "Cảnh cắt nâng cao"
		}, {
			"value": "Full motion video",
			"translation": "Video chuyển động đầy đủ"
		}, {
			"value": "Interactive story",
			"translation": "Cốt truyện tương tác"
		}, {
			"value": "Moral choices",
			"translation": "Lựa chọn đạo đức"
		}, {
			"value": "Immersive story telling",
			"translation": "Kể chuyện nhập vai"
		}, {
			"value": "Reactive quests",
			"translation": "Nhiệm vụ tương tác"
		}, {
			"value": "Better dialogues",
			"translation": "Hội thoại tốt hơn"
		}, {
			"value": "Dialogue tree",
			"translation": "Cây hội thoại"
		}, {
			"value": "Voice over",
			"translation": "Lồng tiếng"
		}, {
			"value": "Simple body language",
			"translation": "Ngôn ngữ cơ thể đơn giản"
		}, {
			"value": "Advanced body language",
			"translation": "Ngôn ngữ cơ thể nâng cao"
		}, {
			"value": "Celebrity voice acting",
			"translation": "Lồng tiếng người nổi tiếng"
		}, {
			"value": "Realistic body language",
			"translation": "Ngôn ngữ cơ thể thực tế"
		}, {
			"value": "Open world",
			"translation": "Thế giới mở"
		}, {
			"value": "Day & night cycle",
			"translation": "Chu kỳ ngày & đêm"
		}, {
			"value": "Rich backstory",
			"translation": "Cốt truyện phong phú"
		}, {
			"value": "Virtual economy",
			"translation": "Kinh tế ảo"
		}, {
			"value": "Realistic weather",
			"translation": "Thời tiết thực tế"
		}, {
			"value": "Dynamic world",
			"translation": "Thế giới động"
		}, {
			"value": "Level editor",
			"translation": "Trình chỉnh sửa màn chơi"
		}, {
			"value": "Easter eggs",
			"translation": "Trứng Phục sinh"
		}, {
			"value": "Mini games",
			"translation": "Trò chơi nhỏ"
		}, {
			"value": "No loading screens",
			"translation": "Không có màn hình tải"
		}, {
			"value": "Medium Games",
			"translation": "Game Cỡ Vừa"
		}, {
			"value": "Project Management",
			"translation": "Quản lý Dự án"
		}, {
			"value": "Large Games",
			"translation": "Game Cỡ Lớn"
		}, {
			"value": "Game Design",
			"translation": "Thiết kế Game"
		}, {
			"value": "Target Audience",
			"translation": "Đối tượng Mục tiêu"
		}, {
			"value": "Sequels",
			"translation": "Phần tiếp theo"
		}, {
			"value": "Casual games",
			"translation": "Game thông thường"
		}, {
			"value": "Marketing",
			"translation": "Marketing"
		}, {
			"value": "Publishing",
			"translation": "Phát hành"
		}, {
			"value": "Multi genre",
			"translation": "Đa thể loại"
		}, {
			"value": "Expansion pack",
			"translation": "Gói mở rộng"
		}, {
			"value": "Red Exploding Barrels",
			"translation": "Thùng Nổ Đỏ"
		}, {
			"value": "Special Items",
			"translation": "Vật phẩm Đặc biệt"
		}, {
			"value": "Lab report",
			"translation": "Báo cáo Phòng thí nghiệm"
		}, {
			"value": "Internet Opportunities",
			"translation": "Cơ hội từ Internet"
		}, {
			"value": "The internet will change our lives forever. This project will investigate how we can use the internet to make better games and deliver better experiences. Completing this project should unlock new options for research.",
			"translation": "Internet sẽ thay đổi cuộc sống của chúng ta mãi mãi. Dự án này sẽ điều tra cách chúng ta có thể sử dụng internet để tạo ra những trò chơi tốt hơn và mang lại trải nghiệm tốt hơn. Hoàn thành dự án này sẽ mở khóa các tùy chọn nghiên cứu mới."
		}, {
			"value": "After careful examination we come to the conclusion that the internet is a huge opportunity in the gaming industry. We already see some small signs how successful multiplayer games can be but multiplayer is usually an additional feature to a game and not the main focus.{n}We think we could develop technologies to create a massively multiplayer online game (short MMO), a game where tens of thousands of players can play together. To create such an MMO more research is necessary.{n}The second discovery is that we could start developing an online distribution platform. Instead of players buying games in local stores they could download games directly from our servers. This would cut out the middle man and we could gain a large share of the market and additional income to fund our developments.",
			"translation": "Sau khi xem xét cẩn thận, chúng tôi đi đến kết luận rằng internet là một cơ hội lớn trong ngành công nghiệp game. Chúng tôi đã thấy một số dấu hiệu nhỏ về mức độ thành công của các trò chơi nhiều người chơi nhưng nhiều người chơi thường là một tính năng bổ sung cho trò chơi chứ không phải là trọng tâm chính.{n}Chúng tôi nghĩ rằng chúng tôi có thể phát triển các công nghệ để tạo ra một trò chơi trực tuyến nhiều người chơi (viết tắt là MMO), một trò chơi mà hàng chục ngàn người chơi có thể chơi cùng nhau. Để tạo ra một MMO như vậy cần nhiều nghiên cứu hơn.{n}Khám phá thứ hai là chúng tôi có thể bắt đầu phát triển một nền tảng phân phối trực tuyến. Thay vì người chơi mua game ở các cửa hàng địa phương, họ có thể tải game trực tiếp từ máy chủ của chúng tôi. Điều này sẽ loại bỏ người trung gian và chúng tôi có thể giành được thị phần lớn và thu nhập bổ sung để tài trợ cho các hoạt động phát triển của mình."
		}, {
			"value": "Codename: Grid",
			"translation": "Mật danh: Grid"
		}, {
			"value": "A bold plan to develop an internet-based distribution platform for games. Rather than buying games through retailers players worldwide can simply download them. The platform features digital rights management to combat piracy and also enables a new market for smaller developers to show off their products.",
			"translation": "Một kế hoạch táo bạo nhằm phát triển một nền tảng phân phối game dựa trên internet. Thay vì mua game qua các nhà bán lẻ, người chơi trên toàn thế giới có thể chỉ cần tải chúng xuống. Nền tảng này có tính năng quản lý bản quyền kỹ thuật số để chống vi phạm bản quyền và cũng tạo ra một thị trường mới cho các nhà phát triển nhỏ hơn giới thiệu sản phẩm của họ."
		}, {
			"value": "Boss, it is done and it is live! Grid is the name of our very own internet-based distribution platform.",
			"translation": "Sếp ơi, xong rồi và nó đã hoạt động! Grid là tên của nền tảng phân phối dựa trên internet của riêng chúng ta."
		}, {
			"value": "Since we already have our own console we have integrated this service into our console. This should boost our market share considerably.",
			"translation": "Vì chúng ta đã có hệ máy console riêng, chúng ta đã tích hợp dịch vụ này vào hệ máy của mình. Điều này sẽ thúc đẩy đáng kể thị phần của chúng ta."
		}, {
			"value": "This system should boost the market share of the PC considerably and if we ever have our own console it will also be of great benefit.",
			"translation": "Hệ thống này sẽ thúc đẩy đáng kể thị phần của PC và nếu chúng ta có hệ máy console riêng, nó cũng sẽ mang lại lợi ích lớn."
		}, {
			"value": "Grid will generate income every month which should boost our ability to create new games and develop new projects.",
			"translation": "Grid sẽ tạo ra thu nhập hàng tháng, điều này sẽ thúc đẩy khả năng của chúng ta trong việc tạo ra các trò chơi mới và phát triển các dự án mới."
		}, {
			"value": "Own Convention",
			"translation": "Hội nghị Riêng"
		}, {
			"value": "It's all well and good to have a booth at the yearly game convention and show off our products but with our large fan base we should consider staging our very own convention instead!",
			"translation": "Thật tốt khi có một gian hàng tại hội nghị game hàng năm và giới thiệu sản phẩm của chúng ta, nhưng với lượng fan lớn của mình, chúng ta nên cân nhắc việc tổ chức một hội nghị của riêng mình!"
		}, {
			"value": "Boss, we have completed the organization of our own convention.",
			"translation": "Sếp ơi, chúng ta đã hoàn thành việc tổ chức hội nghị của riêng mình."
		}, {
			"value": "3D Graphics V6",
			"translation": "Đồ họa 3D V6"
		}, {
			"value": "Pushing the boundaries of photorealism this revolutionary graphics engine will blow away everything that has come before. Near infinite draw distance, ultra-high polygon counts and realistic particle and volumetric effects.",
			"translation": "Vượt qua ranh giới của chủ nghĩa ảnh thực, engine đồ họa mang tính cách mạng này sẽ thổi bay mọi thứ đã có trước đây. Khoảng cách vẽ gần như vô hạn, số lượng đa giác cực cao và các hiệu ứng hạt và thể tích thực tế."
		}, {
			"value": "We have successfully completed the research on our next generation graphics technology and we can now start building a game engine to make use of this research.",
			"translation": "Chúng tôi đã hoàn thành thành công nghiên cứu về công nghệ đồ họa thế hệ tiếp theo của mình và giờ đây chúng tôi có thể bắt đầu xây dựng một game engine để tận dụng nghiên cứu này."
		}, {
			"value": "3D Graphics V7",
			"translation": "Đồ họa 3D V7"
		}, {
			"value": "The ultimate in graphics technology. This will look better than reality. If anyone ever builds a holodeck then this is the graphics engine it would run on.",
			"translation": "Công nghệ đồ họa tối thượng. Cái này sẽ trông đẹp hơn cả thực tế. Nếu có ai đó từng xây dựng một holodeck thì đây chính là engine đồ họa mà nó sẽ chạy."
		}, {
			"value": "We have done it! Our research was successful and we should be able to support our concepts for the ultimate graphics technology in our next game engine. This will be a revolution for the gaming industry!",
			"translation": "Chúng ta đã làm được! Nghiên cứu của chúng ta đã thành công và chúng ta sẽ có thể hỗ trợ các ý tưởng của mình cho công nghệ đồ họa tối thượng trong game engine tiếp theo. Đây sẽ là một cuộc cách mạng cho ngành công nghiệp game!"
		}, {
			"value": "License Game Engines",
			"translation": "Cấp phép Engine Game"
		}, {
			"value": "We have a lot of experience in creating custom game engines. Why not sub-license our engines to other developers? Not only will this cement our market position as a technology leader but it will also help offset the growing costs of developing engines.",
			"translation": "Chúng tôi có rất nhiều kinh nghiệm trong việc tạo ra các engine game tùy chỉnh. Tại sao không cấp phép lại các engine của chúng tôi cho các nhà phát triển khác? Điều này không chỉ củng cố vị thế thị trường của chúng tôi với tư cách là người dẫn đầu về công nghệ mà còn giúp bù đắp chi phí phát triển engine ngày càng tăng."
		}, {
			"value": "Software doesn't run without hardware. We are experts in creating software but why not also investigate whether we can create our own hardware?",
			"translation": "Phần mềm không thể chạy nếu không có phần cứng. Chúng tôi là chuyên gia trong việc tạo ra phần mềm nhưng tại sao không điều tra xem liệu chúng tôi có thể tạo ra phần cứng của riêng mình hay không?"
		}, {
			"value": "Our research is complete. There is definitely a big opportunity ahead of us. If we create our own hardware lab and have the appropriate technology specialists to run it then we could even create our very own gaming console!{n}It would not be cheap and it will probably take us a few years but maybe we could even trump the likes of an mBox or the Playsystem!",
			"translation": "Nghiên cứu của chúng tôi đã hoàn tất. Chắc chắn có một cơ hội lớn phía trước. Nếu chúng tôi tạo ra phòng thí nghiệm phần cứng của riêng mình và có các chuyên gia công nghệ phù hợp để vận hành nó thì chúng tôi thậm chí có thể tạo ra hệ máy chơi game của riêng mình!{n}Sẽ không rẻ và có lẽ sẽ mất vài năm nhưng có thể chúng tôi thậm chí còn vượt qua cả những cái tên như mBox hay Playsystem!"
		}, {
			"value": "Before we can think about creating this lab we need at least one technology specialist on our team so this should be our priority.",
			"translation": "Trước khi chúng ta có thể nghĩ đến việc tạo ra phòng thí nghiệm này, chúng ta cần ít nhất một chuyên gia công nghệ trong đội của mình, vì vậy đây phải là ưu tiên của chúng ta."
		}, {
			"value": "MMO",
			"translation": "MMO"
		}, {
			"value": "Massively Multiplayer Online games! We know how much fun it is to play multiplayer games but imagine that instead of playing with a handful of players you could play with thousands! This project will unlock a brand new genre to allow you to create MMO games.",
			"translation": "Game Online Nhiều Người Chơi Khổng Lồ! Chúng ta biết chơi game nhiều người vui như thế nào nhưng hãy tưởng tượng thay vì chơi với một vài người, bạn có thể chơi với hàng ngàn người! Dự án này sẽ mở khóa một thể loại hoàn toàn mới cho phép bạn tạo ra các trò chơi MMO."
		}, {
			"value": "Boss, our research into massively multiplayer online (MMO) games is complete. The possibilities of MMOs are big but they are also risky. In our research we realized that before we can begin to develop an MMO we will need to create a special game engine for it.{n}You will need to complete the research for the MMO support feature with one of your staff. Once it is integrated into a game engine you can start building an MMO but be careful. It seems that MMOs only work with the best theme/genre combinations and you will also need to have specialists on your team to make an MMO successful.",
			"translation": "Sếp ơi, nghiên cứu của chúng ta về các trò chơi trực tuyến nhiều người chơi (MMO) đã hoàn tất. Tiềm năng của MMO rất lớn nhưng cũng đầy rủi ro. Trong quá trình nghiên cứu, chúng tôi nhận ra rằng trước khi có thể bắt đầu phát triển MMO, chúng ta sẽ cần tạo ra một engine game đặc biệt cho nó.{n}Bạn sẽ cần hoàn thành nghiên cứu về tính năng hỗ trợ MMO với một trong những nhân viên của mình. Sau khi nó được tích hợp vào một engine game, bạn có thể bắt đầu xây dựng một MMO nhưng hãy cẩn thận. Có vẻ như MMO chỉ hoạt động với các kết hợp chủ đề/thể loại tốt nhất và bạn cũng sẽ cần có các chuyên gia trong đội của mình để MMO thành công."
		}, {
			"value": "AAA Games",
			"translation": "Game AAA"
		}, {
			"value": "We have proven that we can make large games work. How about we see how we can make games that are so massive in scope and of such high quality that they will create an entire new label. To borrow a term from the finance sector they will be triple A rated games or to borrow from the movie industry, true blockbusters.",
			"translation": "Chúng ta đã chứng minh rằng chúng ta có thể làm cho các trò chơi lớn hoạt động. Vậy tại sao chúng ta không xem xét cách tạo ra những trò chơi có quy mô lớn và chất lượng cao đến mức chúng sẽ tạo ra một nhãn hiệu hoàn toàn mới. Mượn một thuật ngữ từ lĩnh vực tài chính, chúng sẽ là những trò chơi được xếp hạng ba A hoặc mượn từ ngành công nghiệp điện ảnh, những bộ phim bom tấn thực sự."
		}, {
			"value": "Boss, our research into AAA games is complete and we can now begin to create AAA games. A triple A game requires well-trained staff and it is best to have specialists in the different areas to make sure the team does their best work.{n}When creating a AAA game we can also use the R&D lab to develop a special marketing campaign which greatly enhances the hype around the game.",
			"translation": "Sếp ơi, nghiên cứu của chúng ta về các trò chơi AAA đã hoàn tất và giờ đây chúng ta có thể bắt đầu tạo ra các trò chơi AAA. Một trò chơi AAA đòi hỏi đội ngũ nhân viên được đào tạo bài bản và tốt nhất là có các chuyên gia trong các lĩnh vực khác nhau để đảm bảo đội ngũ làm việc hiệu quả nhất.{n}Khi tạo một trò chơi AAA, chúng ta cũng có thể sử dụng phòng R&D để phát triển một chiến dịch marketing đặc biệt giúp tăng cường đáng kể sự chú ý xung quanh trò chơi."
		}, {
			"value": "The hardware lab can also be used to develop special hardware products such as keyboard, mice and headsets that are sold with the game.",
			"translation": "Phòng thí nghiệm phần cứng cũng có thể được sử dụng để phát triển các sản phẩm phần cứng đặc biệt như bàn phím, chuột và tai nghe được bán kèm với trò chơi."
		}, {
			"value": "Marketing Campaign",
			"translation": "Chiến dịch Marketing"
		}, {
			"value": "Let's use our in-house skills to design a special marketing campaign for our AAA title.",
			"translation": "Hãy sử dụng kỹ năng nội bộ của chúng ta để thiết kế một chiến dịch marketing đặc biệt cho tựa game AAA của mình."
		}, {
			"value": "Custom Hardware",
			"translation": "Phần cứng Tùy chỉnh"
		}, {
			"value": "Let's use our in-house hardware lab to design and develop special hardware products to coincide with the release of our AAA title.",
			"translation": "Hãy sử dụng phòng thí nghiệm phần cứng nội bộ của chúng ta để thiết kế và phát triển các sản phẩm phần cứng đặc biệt trùng với thời điểm phát hành tựa game AAA của mình."
		}, {
			"value": "The first reviews for our newly released game, {0}, came in!",
			"translation": "Những bài đánh giá đầu tiên cho trò chơi mới phát hành của chúng ta, {0}, đã có rồi!"
		}, {
			"value": "Game review",
			"comment": "heading",
			"translation": "Đánh giá game"
		}, {
			"value": "They achieved a great balance between technology and design.",
			"translation": "Họ đã đạt được sự cân bằng tuyệt vời giữa công nghệ và thiết kế."
		}, {
			"value": "They should focus more on design.",
			"translation": "Họ nên tập trung hơn vào thiết kế."
		}, {
			"value": "They should focus more on technology.",
			"translation": "Họ nên tập trung hơn vào công nghệ."
		}, {
			"value": "Their focus on {0} served this game very well.",
			"translation": "Sự tập trung của họ vào {0} đã phục vụ rất tốt cho trò chơi này."
		}, {
			"value": "Their focus on {0} is a bit odd.",
			"translation": "Sự tập trung của họ vào {0} hơi kỳ lạ."
		}, {
			"value": "They shouldn't forget about {0}.",
			"translation": "Họ không nên quên {0}."
		}, {
			"value": "{0} and {1} is a great combination.",
			"translation": "{0} và {1} là một sự kết hợp tuyệt vời."
		}, {
			"value": "Another {0}/{1} game?",
			"translation": "Lại một game {0}/{1} nữa à?"
		}, {
			"value": "{0} games don't work well on {1}.",
			"translation": "Game {0} không hoạt động tốt trên {1}."
		}, {
			"value": "{0} games work well on {1}.",
			"translation": "Game {0} hoạt động tốt trên {1}."
		}, {
			"value": "Already a expansion pack?",
			"translation": "Đã có gói mở rộng rồi sao?"
		}, {
			"value": "Didn't we just play {0} recently?",
			"translation": "Chẳng phải chúng ta vừa mới chơi {0} gần đây sao?"
		}, {
			"value": "Riddled with bugs.",
			"translation": "Đầy rẫy lỗi."
		}, {
			"value": "Too many bugs.",
			"translation": "Quá nhiều lỗi."
		}, {
			"value": "Technology is not state of the art.",
			"translation": "Công nghệ chưa phải là hiện đại nhất."
		}, {
			"value": "What a horrible expansion pack!",
			"translation": "Thật là một gói mở rộng kinh khủng!"
		}, {
			"value": "What a horrible sequel!",
			"translation": "Thật là một phần tiếp theo kinh khủng!"
		}, {
			"value": "Average expansion pack.",
			"translation": "Gói mở rộng trung bình."
		}, {
			"value": "Average sequel.",
			"translation": "Phần tiếp theo trung bình."
		}, {
			"value": "Great expansion pack.",
			"translation": "Gói mở rộng tuyệt vời."
		}, {
			"value": "Great sequel!",
			"translation": "Phần tiếp theo tuyệt vời!"
		}, {
			"value": "As {0} as the name.",
			"comment": "{0} adjective",
			"translation": "{0} như cái tên của nó."
		}, {
			"value": "boring",
			"translation": "nhàm chán"
		}, {
			"value": "generic",
			"translation": "chung chung"
		}, {
			"value": "uninspired",
			"translation": "thiếu cảm hứng"
		}, {
			"value": "dull",
			"translation": "tẻ nhạt"
		}, {
			"value": "The name says it all.",
			"translation": "Cái tên nói lên tất cả."
		}, {
			"value": "N/A not worth a statement.",
			"translation": "Không áp dụng/Không đáng để bình luận."
		}, {
			"value": "One of the worst!",
			"translation": "Một trong những thứ tệ nhất!"
		}, {
			"value": "Makes you cry.",
			"translation": "Làm bạn phát khóc."
		}, {
			"value": "Don't buy!",
			"translation": "Đừng mua!"
		}, {
			"value": "Horrible.",
			"translation": "Kinh khủng."
		}, {
			"value": "I still have nightmares!",
			"translation": "Tôi vẫn còn gặp ác mộng!"
		}, {
			"value": "A disaster!",
			"translation": "Một thảm họa!"
		}, {
			"value": "Really bad.",
			"translation": "Thực sự tệ."
		}, {
			"value": "Utterly uninspiring.",
			"translation": "Hoàn toàn thiếu cảm hứng."
		}, {
			"value": "Not fun.",
			"translation": "Không vui."
		}, {
			"value": "Boring.",
			"translation": "Nhàm chán."
		}, {
			"value": "Disappointing.",
			"translation": "Đáng thất vọng."
		}, {
			"value": "Bin material.",
			"translation": "Đồ bỏ đi."
		}, {
			"value": "Bad.",
			"translation": "Tệ."
		}, {
			"value": "Abysmal.",
			"translation": "Tồi tệ."
		}, {
			"value": "Waste of money.",
			"translation": "Phí tiền."
		}, {
			"value": "Waste of time.",
			"translation": "Phí thời gian."
		}, {
			"value": "Not much fun.",
			"translation": "Không vui lắm."
		}, {
			"value": "Pretty bad.",
			"translation": "Khá tệ."
		}, {
			"value": "Not bad. Not good.",
			"translation": "Không tệ. Không tốt."
		}, {
			"value": "Meh!",
			"translation": "Chậc!"
		}, {
			"value": "OK.",
			"translation": "Được."
		}, {
			"value": "Uninspiring.",
			"translation": "Thiếu cảm hứng."
		}, {
			"value": "Falls a bit short.",
			"translation": "Hơi thiếu một chút."
		}, {
			"value": "Fun at stages.",
			"translation": "Vui ở một số giai đoạn."
		}, {
			"value": "Has its moments.",
			"translation": "Có những khoảnh khắc đáng nhớ."
		}, {
			"value": "Have seen better.",
			"translation": "Đã từng thấy tốt hơn."
		}, {
			"value": "Shows potential.",
			"translation": "Cho thấy tiềm năng."
		}, {
			"value": "Quirky but good.",
			"translation": "Kỳ quặc nhưng hay."
		}, {
			"value": "I like it.",
			"translation": "Tôi thích nó."
		}, {
			"value": "Good game.",
			"translation": "Game hay."
		}, {
			"value": "Enjoyable.",
			"translation": "Thú vị."
		}, {
			"value": "Nice experience.",
			"translation": "Trải nghiệm tốt."
		}, {
			"value": "Beautiful.",
			"translation": "Tuyệt đẹp."
		}, {
			"value": "Very good.",
			"translation": "Rất tốt."
		}, {
			"value": "Very enjoyable.",
			"translation": "Rất thú vị."
		}, {
			"value": "Love it!",
			"translation": "Yêu nó!"
		}, {
			"value": "Played it for days.",
			"translation": "Chơi nó cả ngày."
		}, {
			"value": "Great!",
			"translation": "Tuyệt vời!"
		}, {
			"value": "Almost perfect.",
			"translation": "Gần như hoàn hảo."
		}, {
			"value": "One of the best.",
			"translation": "Một trong những cái hay nhất."
		}, {
			"value": "More please.",
			"translation": "Thêm nữa đi."
		}, {
			"value": "Great game.",
			"translation": "Game tuyệt vời."
		}, {
			"value": "Outstanding game.",
			"translation": "Game xuất sắc."
		}, {
			"value": "Can't wait for the sequel.",
			"translation": "Không thể chờ đợi phần tiếp theo."
		}, {
			"value": "A masterpiece.",
			"translation": "Một kiệt tác."
		}, {
			"value": "Best of its kind.",
			"translation": "Hay nhất trong thể loại này."
		}, {
			"value": "Truly great.",
			"translation": "Thực sự tuyệt vời."
		}, {
			"value": "Everyone loves it!",
			"translation": "Mọi người đều thích nó!"
		}, {
			"value": "Must have!",
			"translation": "Phải có!"
		}, {
			"value": "Outstanding achievement.",
			"translation": "Thành tựu xuất sắc."
		}, {
			"value": "Awesome!",
			"translation": "Tuyệt vời!"
		}, {
			"value": "My new favorite!",
			"translation": "Món yêu thích mới của tôi!"
		}, {
			"value": "{0} sales",
			"translation": "Doanh thu {0}"
		}, {
			"value": "{0} maintenance",
			"translation": "Bảo trì {0}"
		}, {
			"value": "{0} was so successful that we now have {1} fans!",
			"translation": "{0} thành công đến nỗi bây giờ chúng ta có {1} người hâm mộ!"
		}, {
			"value": "{0} sold {1} units in its first week on the market.",
			"translation": "{0} đã bán được {1} bản trong tuần đầu tiên ra mắt."
		}, {
			"value": "We made it in the charts at #{0}!",
			"translation": "Chúng ta đã lọt vào bảng xếp hạng ở vị trí #{0}!"
		}, {
			"value": "First week of sales!",
			"translation": "Tuần đầu tiên bán hàng!"
		}, {
			"value": "{0} is now off the market. It sold {1} units generating {2} in sales.",
			"translation": "{0} hiện đã ngừng bán. Nó đã bán được {1} bản, tạo ra {2} doanh thu."
		}, {
			"value": "Game off the market.",
			"comment": "heading",
			"translation": "Game ngừng bán."
		}, {
			"value": " SDK",
			"comment": "short for Software Development Kit",
			"translation": " SDK"
		}, {
			"value": "Sales Record",
			"comment": "heading",
			"translation": "Kỷ lục Doanh thu"
		}, {
			"value": "{0} has achieved a company sales record with over {1} units sold!\nThis is an important milestone in the history of {2}!",
			"translation": "{0} đã đạt kỷ lục doanh thu công ty với hơn {1} bản được bán ra!\nĐây là một cột mốc quan trọng trong lịch sử của {2}!"
		}, {
			"value": "We just got word that {0} which was recently released by {1} has racked up over {2} in sales.",
			"translation": "Chúng tôi vừa nhận được tin rằng {0} do {1} phát hành gần đây đã thu về hơn {2} doanh thu."
		}, {
			"value": "If the game were a music record it would have {0} status.{n}",
			"comment": "{0} gold, platinum etc.",
			"translation": "Nếu trò chơi là một bản thu âm nhạc, nó sẽ đạt được trạng thái {0}.{n}"
		}, {
			"value": "An incredible achievement",
			"translation": "Một thành tựu đáng kinh ngạc"
		}, {
			"value": "This is an unbelievably high number.",
			"translation": "Đây là một con số cao không thể tin được."
		}, {
			"value": "This game truly deserves to be called AAA.",
			"translation": "Trò chơi này thực sự xứng đáng được gọi là AAA."
		}, {
			"value": "Only a true master of the industry could achieve such a milestone. {0} will forever be remembered in gaming history for this.",
			"translation": "Chỉ một bậc thầy thực sự của ngành công nghiệp mới có thể đạt được cột mốc như vậy. {0} sẽ mãi mãi được ghi nhớ trong lịch sử game vì điều này."
		}, {
			"value": "The excitement around the game seems to have no end.",
			"translation": "Sự phấn khích xung quanh trò chơi dường như không có hồi kết."
		}, {
			"value": "We wonder how many more it will sell.",
			"translation": "Chúng tôi tự hỏi nó sẽ bán được bao nhiêu bản nữa."
		}, {
			"value": "Competitors have been observed muttering jealous remarks.",
			"translation": "Các đối thủ cạnh tranh đã bị bắt gặp lẩm bẩm những lời nhận xét ghen tị."
		}, {
			"value": "Go {0}! Well done!",
			"translation": "Cố lên {0}! Làm tốt lắm!"
		}, {
			"value": "According to our market research the recently published game '{0}' is a surprise hit with players.",
			"translation": "Theo nghiên cứu thị trường của chúng tôi, trò chơi '{0}' được phát hành gần đây là một cú hit bất ngờ với người chơi."
		}, {
			"value": "The developer {0} is fairly new to the gaming industry but we cannot wait for what they will develop next!",
			"translation": "Nhà phát triển {0} còn khá mới trong ngành công nghiệp game nhưng chúng tôi không thể chờ đợi xem họ sẽ phát triển gì tiếp theo!"
		}, {
			"value": "The latest game by {0} has received very positive reviews overall!\n{1} gave it a '{2}' saying '{3}'.",
			"translation": "Trò chơi mới nhất của {0} đã nhận được những đánh giá rất tích cực nhìn chung!\n{1} đã cho nó điểm '{2}' và nói rằng '{3}'."
		}, {
			"value": "If {0} continues to innovate like this they might become a new fan favorite!",
			"translation": "Nếu {0} tiếp tục đổi mới như thế này, họ có thể trở thành một cái tên được người hâm mộ yêu thích!"
		}, {
			"value": "{0}, the newest game by {1} has caused a storm of good reviews and excited customers.",
			"translation": "{0}, trò chơi mới nhất của {1} đã tạo ra một cơn bão những đánh giá tốt và những khách hàng hào hứng."
		}, {
			"value": "Industry professionals say that {0} is one of these rare games that will set a new quality standard for future games.{n}",
			"translation": "Các chuyên gia trong ngành nói rằng {0} là một trong những trò chơi hiếm hoi sẽ đặt ra một tiêu chuẩn chất lượng mới cho các trò chơi trong tương lai.{n}"
		}, {
			"value": "It seems that {0} really has made gaming history with {1}!\nWell done!",
			"translation": "Có vẻ như {0} thực sự đã làm nên lịch sử game với {1}!\nLàm tốt lắm!"
		}, {
			"value": "If you are not a fan of {0} now then chances are you will be after playing their latest hit {1}.",
			"translation": "Nếu bây giờ bạn không phải là người hâm mộ của {0} thì rất có thể bạn sẽ trở thành sau khi chơi cú hit mới nhất của họ {1}."
		}, {
			"value": "Ladies and gentlemen, the surprise hit of the year is {1} by {0}.",
			"translation": "Thưa quý vị, cú hit bất ngờ của năm là {1} của {0}."
		}, {
			"value": "When I started playing {1} I had no idea what I was in for.",
			"translation": "Khi tôi bắt đầu chơi {1}, tôi không hề biết mình sẽ phải đối mặt với điều gì."
		}, {
			"value": "There are a lot of good surprises waiting for you in {1}.",
			"translation": "Có rất nhiều bất ngờ thú vị đang chờ bạn trong {1}."
		}, {
			"value": "Another memorable game by {0} has been released.",
			"translation": "Một trò chơi đáng nhớ khác của {0} đã được phát hành."
		}, {
			"value": "I have been playing {1} and have tremendously enjoyed the experience.",
			"translation": "Tôi đã chơi {1} và vô cùng thích thú với trải nghiệm này."
		}, {
			"value": "{0} surprises us again with a very enjoyable game.",
			"translation": "{0} lại gây bất ngờ cho chúng ta với một trò chơi rất thú vị."
		}, {
			"value": "Rarely will a game captivate you as much as {1}.",
			"translation": "Hiếm có trò chơi nào có thể thu hút bạn nhiều như {1}."
		}, {
			"value": "{1} really deserves the top spots in the charts.",
			"translation": "{1} thực sự xứng đáng đứng đầu bảng xếp hạng."
		}, {
			"value": "Simply one of the best games I've played.",
			"translation": "Đơn giản là một trong những trò chơi hay nhất tôi từng chơi."
		}, {
			"value": "Well, what can I say? Stop reading. Start playing.",
			"translation": "Chà, tôi có thể nói gì đây? Ngừng đọc đi. Bắt đầu chơi thôi."
		}, {
			"value": "A stellar effort by {0}.",
			"translation": "Một nỗ lực xuất sắc của {0}."
		}, {
			"value": "To {0}: Keep the hits coming please :)",
			"translation": "Gửi {0}: Tiếp tục tạo ra những cú hit nhé :)"
		}, {
			"value": "Only a game with unicorns, rainbows, pirates and ninjas could possibly be better.",
			"translation": "Chỉ có một trò chơi với kỳ lân, cầu vồng, cướp biển và ninja mới có thể hay hơn."
		}, {
			"value": "Summary: best. game. ever.",
			"translation": "Tóm lại: game. hay. nhất. từ. trước. đến. nay."
		}, {
			"value": "There is a rare technical polish in this game which really comes through in the overall experience.",
			"translation": "Có một sự chau chuốt kỹ thuật hiếm có trong trò chơi này, điều thực sự thể hiện rõ trong trải nghiệm tổng thể."
		}, {
			"value": "The game shines of technical excellence. Clearly the developers know what they are doing.",
			"translation": "Trò chơi tỏa sáng với sự xuất sắc về kỹ thuật. Rõ ràng là các nhà phát triển biết họ đang làm gì."
		}, {
			"value": "I was positively surprised to see the level of polish that went into the underlying game engine. The effort really paid off.",
			"translation": "Tôi đã rất ngạc nhiên một cách tích cực khi thấy mức độ chau chuốt được đầu tư vào engine game nền tảng. Nỗ lực đó thực sự đã được đền đáp."
		}, {
			"value": "In this type of game the core gameplay mechanics are really important and the developer has nailed it.",
			"translation": "Trong loại game này, cơ chế gameplay cốt lõi thực sự quan trọng và nhà phát triển đã làm rất tốt."
		}, {
			"value": "I have rarely seen such responsive game controls. A true joy to play.",
			"translation": "Tôi hiếm khi thấy một hệ thống điều khiển game nhạy bén như vậy. Thực sự là một niềm vui khi chơi."
		}, {
			"value": "The attention to detail to the core gameplay has really paid off.",
			"translation": "Sự chú ý đến từng chi tiết của gameplay cốt lõi thực sự đã mang lại hiệu quả."
		}, {
			"value": "This game doesn't just tell a story, no, it manages to draw you in so that you truly feel part of an adventure.",
			"translation": "Trò chơi này không chỉ kể một câu chuyện, không, nó còn thu hút bạn đến mức bạn thực sự cảm thấy mình là một phần của cuộc phiêu lưu."
		}, {
			"value": "A true achievement in interactive story telling, the characters and the captivating scenarios just stick in your mind.",
			"translation": "Một thành tựu thực sự trong kể chuyện tương tác, các nhân vật và những kịch bản hấp dẫn cứ mãi luẩn quẩn trong tâm trí bạn."
		}, {
			"value": "Whoever wrote the story of {1} will likely win a prize for it.",
			"translation": "Bất cứ ai viết câu chuyện của {1} đều có khả năng giành được giải thưởng cho nó."
		}, {
			"value": "The character dialogues in this game are just oustanding. Rarely will you be so captivated in a conversation.",
			"translation": "Các đoạn hội thoại của nhân vật trong trò chơi này thật xuất sắc. Hiếm khi bạn bị cuốn hút vào một cuộc trò chuyện đến vậy."
		}, {
			"value": "The term dialogue tree really doesn't do {1} justice. This game has a dialogue forest... in a good way.",
			"translation": "Thuật ngữ cây hội thoại thực sự không thể hiện hết được {1}. Trò chơi này có cả một rừng hội thoại... theo một cách tốt."
		}, {
			"value": "A perfect example on how dialogues in a game can be so much more thrilling than in a movie or book. At every stage I felt like I really had choices and was driving the story.",
			"translation": "Một ví dụ hoàn hảo về cách các đoạn hội thoại trong game có thể hấp dẫn hơn nhiều so với phim ảnh hay sách truyện. Ở mọi giai đoạn, tôi đều cảm thấy mình thực sự có lựa chọn và đang dẫn dắt câu chuyện."
		}, {
			"value": "The progression in this story is just perfect. Just when you start to think things settle down something surprising will happen.",
			"translation": "Diễn biến trong câu chuyện này thật hoàn hảo. Ngay khi bạn bắt đầu nghĩ rằng mọi thứ đã ổn định thì một điều bất ngờ sẽ xảy ra."
		}, {
			"value": "The level design is both sophisticated and surprisingly intuitive. I never felt like I was guided through a level but I never ever got lost either. A true achievement.",
			"translation": "Thiết kế màn chơi vừa tinh vi vừa trực quan một cách đáng ngạc nhiên. Tôi chưa bao giờ cảm thấy bị dẫn dắt qua một màn chơi nhưng cũng chưa bao giờ bị lạc. Một thành tựu thực sự."
		}, {
			"value": "Simply iconic level designs, from start to finish.",
			"translation": "Đơn giản là những thiết kế màn chơi mang tính biểu tượng, từ đầu đến cuối."
		}, {
			"value": "The computer-controlled entities in this game are so incredibly convincing that I caught myself talking at them at times.",
			"translation": "Các thực thể do máy tính điều khiển trong trò chơi này thuyết phục đến mức đôi khi tôi thấy mình đang nói chuyện với chúng."
		}, {
			"value": "Rarely manages a game to blend the A.I. so well into the game world that you just feel completely immersed.",
			"translation": "Hiếm có trò chơi nào quản lý để hòa trộn A.I. tốt đến vậy vào thế giới game khiến bạn cảm thấy hoàn toàn đắm chìm."
		}, {
			"value": "The game responds to the player in such a realistic fashion that it makes you sometimes forget that this is just a game.",
			"translation": "Trò chơi phản hồi người chơi một cách thực tế đến nỗi đôi khi bạn quên mất đây chỉ là một trò chơi."
		}, {
			"value": "A wonderfully imaginative gameworld makes {1} a joy to discover. You will spend hours travelling through this world.",
			"translation": "Một thế giới game giàu trí tưởng tượng tuyệt vời khiến {1} trở thành một niềm vui để khám phá. Bạn sẽ dành hàng giờ để du hành qua thế giới này."
		}, {
			"value": "This is world design at its best. Brave, imaginative and unapologetically following its incredible artistic vision.",
			"translation": "Đây là thiết kế thế giới ở đỉnh cao nhất. Dũng cảm, giàu trí tưởng tượng và không ngần ngại theo đuổi tầm nhìn nghệ thuật đáng kinh ngạc của nó."
		}, {
			"value": "The attention to detail in the world design really sets this game apart from others in the genre.",
			"translation": "Sự chú ý đến từng chi tiết trong thiết kế thế giới thực sự khiến trò chơi này khác biệt so với những trò chơi khác cùng thể loại."
		}, {
			"value": "Visually pleasing is an understatement. This game looks incredibly good.",
			"translation": "Đẹp mắt về mặt hình ảnh là một cách nói giảm nói tránh. Trò chơi này trông cực kỳ đẹp."
		}, {
			"value": "The art style in {1} blends so well with the general feeling of the game. A perfect match.",
			"translation": "Phong cách nghệ thuật trong {1} hòa quyện rất tốt với cảm giác chung của trò chơi. Một sự kết hợp hoàn hảo."
		}, {
			"value": "Truly oustanding visual design is only one of the many reasons why {1} deserves your attention.",
			"translation": "Thiết kế hình ảnh thực sự xuất sắc chỉ là một trong nhiều lý do tại sao {1} xứng đáng với sự chú ý của bạn."
		}, {
			"value": "I rarely highlight the sound of a game instead of the many other noteworthy features but in {1} the sound design was truly awe-inspiring.",
			"translation": "Tôi hiếm khi làm nổi bật âm thanh của một trò chơi thay vì nhiều tính năng đáng chú ý khác nhưng trong {1}, thiết kế âm thanh thực sự gây kinh ngạc."
		}, {
			"value": "The sound in this game gives you goose bumps. Very well designed.",
			"translation": "Âm thanh trong trò chơi này khiến bạn nổi da gà. Thiết kế rất tốt."
		}, {
			"value": "The game doesn't just look good it sounds incredibly good too. A true feast for players who appreciate high quality sound.",
			"translation": "Trò chơi không chỉ trông đẹp mà còn nghe cực kỳ hay. Một bữa tiệc thực sự cho những người chơi đánh giá cao âm thanh chất lượng cao."
		}, {
			"value": "Sports",
			"comment": "game topic",
			"translation": "Thể thao"
		}, {
			"value": "Military",
			"comment": "game topic",
			"translation": "Quân sự"
		}, {
			"value": "Medieval",
			"comment": "game topic",
			"translation": "Trung cổ"
		}, {
			"value": "Space",
			"comment": "game topic",
			"translation": "Không gian"
		}, {
			"value": "Racing",
			"comment": "game topic",
			"translation": "Đua xe"
		}, {
			"value": "Fantasy",
			"comment": "game topic",
			"translation": "Giả tưởng"
		}, {
			"value": "Pirate",
			"comment": "game topic",
			"translation": "Cướp biển"
		}, {
			"value": "Sci-Fi",
			"comment": "game topic",
			"translation": "Khoa học viễn tưởng"
		}, {
			"value": "Airplane",
			"comment": "game topic",
			"translation": "Máy bay"
		}, {
			"value": "Dungeon",
			"comment": "game topic",
			"translation": "Hầm ngục"
		}, {
			"value": "Mystery",
			"comment": "game topic",
			"translation": "Bí ẩn"
		}, {
			"value": "Martial Arts",
			"comment": "game topic",
			"translation": "Võ thuật"
		}, {
			"value": "History",
			"comment": "game topic",
			"translation": "Lịch sử"
		}, {
			"value": "Horror",
			"comment": "game topic",
			"translation": "Kinh dị"
		}, {
			"value": "Business",
			"comment": "game topic",
			"translation": "Kinh doanh"
		}, {
			"value": "Transport",
			"comment": "game topic",
			"translation": "Vận tải"
		}, {
			"value": "Comedy",
			"comment": "game topic",
			"translation": "Hài kịch"
		}, {
			"value": "Ninja",
			"comment": "game topic",
			"translation": "Ninja"
		}, {
			"value": "Romance",
			"comment": "game topic",
			"translation": "Lãng mạn"
		}, {
			"value": "Spy",
			"comment": "game topic",
			"translation": "Điệp viên"
		}, {
			"value": "Cyberpunk",
			"comment": "game topic",
			"translation": "Cyberpunk"
		}, {
			"value": "UFO",
			"comment": "game topic",
			"translation": "UFO"
		}, {
			"value": "Hospital",
			"comment": "game topic",
			"translation": "Bệnh viện"
		}, {
			"value": "Evolution",
			"comment": "game topic",
			"translation": "Tiến hóa"
		}, {
			"value": "Time Travel",
			"comment": "game topic",
			"translation": "Du hành thời gian"
		}, {
			"value": "Life",
			"comment": "game topic",
			"translation": "Cuộc sống"
		}, {
			"value": "Virtual Pet",
			"comment": "game topic",
			"translation": "Thú cưng ảo"
		}, {
			"value": "Vocabulary",
			"comment": "game topic",
			"translation": "Từ vựng"
		}, {
			"value": "Hunting",
			"comment": "game topic",
			"translation": "Săn bắn"
		}, {
			"value": "Law",
			"comment": "game topic",
			"translation": "Luật pháp"
		}, {
			"value": "Game Dev",
			"comment": "game topic",
			"translation": "Phát triển Game"
		}, {
			"value": "City",
			"comment": "game topic",
			"translation": "Thành phố"
		}, {
			"value": "School",
			"comment": "game topic",
			"translation": "Trường học"
		}, {
			"value": "Fashion",
			"comment": "game topic",
			"translation": "Thời trang"
		}, {
			"value": "Hacking",
			"comment": "game topic",
			"translation": "Hack"
		}, {
			"value": "Government",
			"comment": "game topic",
			"translation": "Chính phủ"
		}, {
			"value": "Prison",
			"comment": "game topic",
			"translation": "Nhà tù"
		}, {
			"value": "Surgery",
			"comment": "game topic",
			"translation": "Phẫu thuật"
		}, {
			"value": "Music",
			"comment": "game topic",
			"translation": "Âm nhạc"
		}, {
			"value": "Rhythm",
			"comment": "game topic",
			"translation": "Nhịp điệu"
		}, {
			"value": "Superheroes",
			"comment": "game topic",
			"translation": "Siêu anh hùng"
		}, {
			"value": "Post Apocalyptic",
			"comment": "game topic",
			"translation": "Hậu tận thế"
		}, {
			"value": "Alternate History",
			"comment": "game topic",
			"translation": "Lịch sử thay thế"
		}, {
			"value": "Vampire",
			"comment": "game topic",
			"translation": "Ma cà rồng"
		}, {
			"value": "Werewolf",
			"comment": "game topic",
			"translation": "Người sói"
		}, {
			"value": "Aliens",
			"comment": "game topic",
			"translation": "Người ngoài hành tinh"
		}, {
			"value": "Wild West",
			"comment": "game topic",
			"translation": "Miền Tây hoang dã"
		}, {
			"value": "Dance",
			"comment": "game topic",
			"translation": "Khiêu vũ"
		}, {
			"value": "Management",
			"translation": "Quản lý"
		}, {
			"value": "Staff Management",
			"translation": "Quản lý Nhân viên"
		}, {
			"value": "Well done!\nYou've successfully completed your management course and you are now able to hire your very first employee!\n To get started close this message and then {0} the 'Fill Position...' button which is visible near the big desk.",
			"translation": "Làm tốt lắm!\nBạn đã hoàn thành xuất sắc khóa học quản lý và bây giờ bạn có thể thuê nhân viên đầu tiên của mình!\n Để bắt đầu, hãy đóng thông báo này và sau đó {0} vào nút 'Tuyển dụng...' hiển thị gần bàn làm việc lớn."
		}, {
			"value": "Staff Welcome Training",
			"translation": "Đào tạo Chào mừng Nhân viên"
		}, {
			"value": "Special",
			"translation": "Đặc biệt"
		}, {
			"value": "Develop patch",
			"translation": "Phát triển bản vá"
		}, {
			"value": "It seems that {0} has finally released their patch for {1}. One fan said: 'I can't believe it took them so long to release a patch! I surely hope that they are more efficient next time!'",
			"translation": "Có vẻ như {0} cuối cùng đã phát hành bản vá cho {1}. Một người hâm mộ nói: 'Tôi không thể tin được họ lại mất nhiều thời gian đến vậy để phát hành bản vá! Tôi chắc chắn hy vọng lần sau họ sẽ hiệu quả hơn!'"
		}, {
			"value": "{0} has recently released a much needed patch for {1}.\nOne fan said: 'I love companies like {0}. They don't just milk their customers for more money but also understand our concerns and make sure that we can enjoy our games!'.",
			"translation": "{0} gần đây đã phát hành một bản vá rất cần thiết cho {1}.\nMột người hâm mộ nói: 'Tôi yêu những công ty như {0}. Họ không chỉ vắt kiệt tiền của khách hàng mà còn hiểu những lo lắng của chúng tôi và đảm bảo rằng chúng tôi có thể tận hưởng trò chơi của mình!'."
		}, {
			"value": "Design Specialist (Req. 700 D)",
			"translation": "Chuyên gia Thiết kế (Yêu cầu 700 Đ)"
		}, {
			"value": "Specialists",
			"translation": "Chuyên gia"
		}, {
			"value": "Technology Specialist (Req. 700 T)",
			"translation": "Chuyên gia Công nghệ (Yêu cầu 700 T)"
		}, {
			"value": "Boost (Req. D:500 or T:500)",
			"translation": "Tăng tốc (Yêu cầu Đ:500 hoặc T:500)"
		}, {
			"value": "Boost Max. Level 3 (Req. D:700 or T:700)",
			"translation": "Tăng tốc Tối đa Cấp 3 (Yêu cầu Đ:700 hoặc T:700)"
		}, {
			"value": "Specialization",
			"translation": "Chuyên môn hóa"
		}, {
			"value": "{0} [Req. {1}D/{2}T]",
			"translation": "{0} [Yêu cầu {1}Đ/{2}T]"
		}, {
			"value": "Coding contest",
			"translation": "Cuộc thi lập trình"
		}, {
			"value": "Teach and learn",
			"translation": "Dạy và học"
		}, {
			"value": "Game Design Course",
			"translation": "Khóa học Thiết kế Game"
		}, {
			"value": "Programming Course",
			"translation": "Khóa học Lập trình"
		}, {
			"value": "Product Management Course",
			"translation": "Khóa học Quản lý Sản phẩm"
		}, {
			"value": "R&D Course",
			"translation": "Khóa học R&D"
		}, {
			"value": "Practice, Practice, Practice",
			"translation": "Thực hành, Thực hành, Thực hành"
		}, {
			"value": "G3 Pixel Cup",
			"translation": "Cúp Pixel G3"
		}, {
			"value": "G3 Code Jam",
			"translation": "G3 Code Jam"
		}, {
			"value": "G3 Game Jam",
			"translation": "G3 Game Jam"
		}, {
			"value": "G3 Time Trials",
			"translation": "Thử thách Thời gian G3"
		}, {
			"value": "G3 Innovation Challenge",
			"translation": "Thử thách Sáng tạo G3"
		}, {
			"value": "Book studies",
			"translation": "Nghiên cứu sách vở"
		}, {
			"value": "Congratulations!\nYou've successfully completed {0}.",
			"translation": "Xin chúc mừng!\nBạn đã hoàn thành xuất sắc {0}."
		}, {
			"value": "Training Complete",
			"translation": "Hoàn thành Đào tạo"
		}, {
			"value": "Tutorial",
			"translation": "Hướng dẫn"
		}, {
			"value": "tap",
			"comment": "verb",
			"translation": "chạm"
		}, {
			"value": "click",
			"comment": "verb",
			"translation": "nhấp"
		}, {
			"value": "Create a company",
			"comment": "heading",
			"translation": "Tạo công ty"
		}, {
			"value": "Congratulations!\nYou've just started your very own game development company!\nAt the moment your office is in a garage and you are the only employee but don't worry, many successful businesses have started out this way!{n}Let's start developing your first game.\nClose this message and then {0} anywhere on the screen to bring up the action menu.",
			"comment": "{0} click/touch verb",
			"translation": "Xin chúc mừng!\nBạn vừa thành lập công ty phát triển game của riêng mình!\nHiện tại văn phòng của bạn ở trong một nhà để xe và bạn là nhân viên duy nhất nhưng đừng lo, nhiều doanh nghiệp thành công đã bắt đầu theo cách này!{n}Hãy bắt đầu phát triển trò chơi đầu tiên của bạn.\nĐóng thông báo này và sau đó {0} vào bất kỳ đâu trên màn hình để mở menu hành động."
		}, {
			"value": "Create a game",
			"comment": "heading",
			"translation": "Tạo trò chơi"
		}, {
			"value": "Before development can begin you have to decide what kind of game you want to create and give your game a name.\nYou can also select which graphic technology your game should use.{n}Your options are initially limited but once you have a bit of experience you will be able to unlock new options.",
			"translation": "Trước khi bắt đầu phát triển, bạn phải quyết định loại trò chơi bạn muốn tạo và đặt tên cho trò chơi của mình.\nBạn cũng có thể chọn công nghệ đồ họa mà trò chơi của bạn sẽ sử dụng.{n}Các lựa chọn của bạn ban đầu bị hạn chế nhưng một khi bạn có một chút kinh nghiệm, bạn sẽ có thể mở khóa các tùy chọn mới."
		}, {
			"value": "Game points",
			"comment": "heading",
			"translation": "Điểm trò chơi"
		}, {
			"value": "First game finished",
			"comment": "heading",
			"translation": "Trò chơi đầu tiên hoàn thành"
		}, {
			"value": "swipe from the edge of the screen to bring up the app bar",
			"comment": "appbar fragment",
			"translation": "vuốt từ cạnh màn hình để mở thanh ứng dụng"
		}, {
			"value": "right click to bring up the app bar",
			"comment": "appbar fragment",
			"translation": "nhấp chuột phải để mở thanh ứng dụng"
		}, {
			"value": "swipe from the right edge of the screen",
			"comment": "charmsbar fragment",
			"translation": "vuốt từ cạnh phải màn hình"
		}, {
			"value": "bring your cursor to the top right corner of the screen and then move down.",
			"comment": "charmsbar fragment",
			"translation": "di chuyển con trỏ của bạn đến góc trên bên phải màn hình rồi di chuyển xuống."
		}, {
			"value": "Appbar and help menu",
			"comment": "heading",
			"translation": "Thanh ứng dụng và menu trợ giúp"
		}, {
			"value": "Contracts unlocked",
			"comment": "heading",
			"translation": "Hợp đồng đã mở khóa"
		}, {
			"value": "Contracts have now been unlocked.\nTo see available contracts close this message and then {0} anywhere on the screen to bring up the action menu.",
			"comment": "{0} click/touch verb",
			"translation": "Hợp đồng hiện đã được mở khóa.\nĐể xem các hợp đồng có sẵn, hãy đóng thông báo này và sau đó {0} vào bất kỳ đâu trên màn hình để mở menu hành động."
		}, {
			"value": "Contracts",
			"translation": "Hợp đồng"
		}, {
			"value": "Contracts are a useful tool to earn some extra cash when your balance is low and can also be useful to generate a small number of research points.\nContracts require you to generate a certain amount of design and technology points before the time runs out.{n}Decide carefully what contract you accept. If you miss the deadline for a contract you will have to pay a penalty so it's better to start out with smaller contracts and see how much you can handle.",
			"translation": "Hợp đồng là một công cụ hữu ích để kiếm thêm tiền khi số dư của bạn thấp và cũng có thể hữu ích để tạo ra một số ít điểm nghiên cứu.\nHợp đồng yêu cầu bạn tạo ra một lượng điểm thiết kế và công nghệ nhất định trước khi hết thời gian.{n}Hãy quyết định cẩn thận hợp đồng nào bạn chấp nhận. Nếu bạn bỏ lỡ thời hạn của một hợp đồng, bạn sẽ phải trả tiền phạt vì vậy tốt hơn là nên bắt đầu với các hợp đồng nhỏ hơn và xem bạn có thể xử lý được bao nhiêu."
		}, {
			"value": "Game released",
			"comment": "heading",
			"translation": "Game đã phát hành"
		}, {
			"value": "Your game is now complete and will be handed off to publishing.\nWe should see reviews and sales coming in for the game soon!",
			"translation": "Trò chơi của bạn hiện đã hoàn thành và sẽ được chuyển giao cho nhà phát hành.\nChúng ta sẽ sớm thấy các bài đánh giá và doanh số bán hàng của trò chơi!"
		}, {
			"value": "Game development completed",
			"comment": "heading",
			"translation": "Hoàn thành phát triển game"
		}, {
			"value": "The development of your game has now finished. While developing games you gain experience and improve your skills.\nWhen development is completed you will be presented with a summary of the experience gained.",
			"translation": "Quá trình phát triển trò chơi của bạn hiện đã kết thúc. Trong quá trình phát triển game, bạn tích lũy kinh nghiệm và cải thiện kỹ năng của mình.\nKhi quá trình phát triển hoàn tất, bạn sẽ được xem một bản tóm tắt về kinh nghiệm đã đạt được."
		}, {
			"value": "First sales",
			"comment": "heading",
			"translation": "Doanh thu đầu tiên"
		}, {
			"value": "Now that your game is on sale you will receive the income from the game every week.\nYou can see how well your game is doing by looking at the sales graph in the top right of the screen.",
			"translation": "Bây giờ trò chơi của bạn đã được bán, bạn sẽ nhận được thu nhập từ trò chơi mỗi tuần.\nBạn có thể xem trò chơi của mình hoạt động tốt như thế nào bằng cách xem biểu đồ doanh thu ở góc trên bên phải màn hình."
		}, {
			"value": "Research",
			"comment": "heading",
			"translation": "Nghiên cứu"
		}, {
			"value": "Research is important to unlock new options and make better games.\nYou should try to save enough research points to be able to create your own game engine.\nThis will greatly improve your games.{n}Hint: Try to develop games with different topic and genre combinations for a slight research boost.",
			"translation": "Nghiên cứu rất quan trọng để mở khóa các tùy chọn mới và tạo ra những trò chơi tốt hơn.\nBạn nên cố gắng tiết kiệm đủ điểm nghiên cứu để có thể tạo ra engine game của riêng mình.\nĐiều này sẽ cải thiện đáng kể trò chơi của bạn.{n}Gợi ý: Hãy thử phát triển các trò chơi với các chủ đề và thể loại khác nhau để tăng nhẹ điểm nghiên cứu."
		}, {
			"value": "Development phases",
			"comment": "heading",
			"translation": "Các giai đoạn phát triển"
		}, {
			"value": "Game development runs through three stages. At the beginning of each stage you can decide what areas of the game you want to focus on.\nPicking the right focus for your game greatly increases the points you generate.{n}Think about what areas are important for your game and decrease the focus on areas you think are less important. If you want to read a brief description of the different areas please refer to the Help menu.",
			"translation": "Phát triển game trải qua ba giai đoạn. Khi bắt đầu mỗi giai đoạn, bạn có thể quyết định những lĩnh vực nào của trò chơi bạn muốn tập trung vào.\nViệc chọn đúng trọng tâm cho trò chơi của bạn sẽ làm tăng đáng kể số điểm bạn tạo ra.{n}Hãy suy nghĩ về những lĩnh vực quan trọng đối với trò chơi của bạn và giảm bớt sự tập trung vào những lĩnh vực bạn cho là ít quan trọng hơn. Nếu bạn muốn đọc mô tả ngắn gọn về các lĩnh vực khác nhau, vui lòng tham khảo menu Trợ giúp."
		}, {
			"value": "Research custom engine",
			"comment": "heading",
			"translation": "Nghiên cứu engine tùy chỉnh"
		}, {
			"value": "Now you can create your own game engines.\nTo get started close this message and {0} anywhere to bring up the action menu.",
			"comment": "{0} click/touch verb",
			"translation": "Bây giờ bạn có thể tạo engine game của riêng mình.\nĐể bắt đầu, hãy đóng thông báo này và {0} vào bất kỳ đâu để mở menu hành động."
		}, {
			"value": "Research engine part",
			"comment": "heading",
			"translation": "Nghiên cứu bộ phận engine"
		}, {
			"value": "You have just researched your first engine part.\nTo be able to use this in your games you need to create a new engine which includes this part.",
			"translation": "Bạn vừa nghiên cứu xong bộ phận engine đầu tiên của mình.\nĐể có thể sử dụng nó trong các trò chơi của bạn, bạn cần tạo một engine mới bao gồm bộ phận này."
		}, {
			"value": "Creating engine",
			"comment": "heading",
			"translation": "Đang tạo engine"
		}, {
			"value": "You are now creating your own custom game engine.\n\nOnce the engine is finished you will be able to use it when creating new games.",
			"translation": "Bạn hiện đang tạo engine game tùy chỉnh của riêng mình.\n\nSau khi engine hoàn thành, bạn sẽ có thể sử dụng nó khi tạo các trò chơi mới."
		}, {
			"value": "Target audience",
			"comment": "heading",
			"translation": "Đối tượng mục tiêu"
		}, {
			"value": "You can now specify what your main target audience is for your game. Games can be targeted at young people, at everyone or at more mature audiences.{n}Picking the right target audience for your game is important. Your target platform can also play a role. Some platforms are especially popular with a specific audience.",
			"translation": "Bây giờ bạn có thể chỉ định đối tượng mục tiêu chính cho trò chơi của mình. Các trò chơi có thể nhắm đến giới trẻ, mọi người hoặc đối tượng người lớn hơn.{n}Việc chọn đúng đối tượng mục tiêu cho trò chơi của bạn rất quan trọng. Nền tảng mục tiêu của bạn cũng có thể đóng một vai trò. Một số nền tảng đặc biệt phổ biến với một đối tượng cụ thể."
		}, {
			"value": "Marketing Unlocked",
			"comment": "heading",
			"translation": "Marketing đã Mở khóa"
		}, {
			"value": "You've successfully unlocked marketing. You can access marketing options in the action menu but only while a game is in development.",
			"translation": "Bạn đã mở khóa thành công marketing. Bạn có thể truy cập các tùy chọn marketing trong menu hành động nhưng chỉ khi trò chơi đang trong quá trình phát triển."
		}, {
			"value": "Marketing can be very effective to reach more potential customers but it can be very expensive too. It is best to experiment carefully with marketing to get a feel for what works best. Don't invest too much and remember that timing is important. Don't invest in your marketing efforts too early in development or too late.{n}It is also important to know that no matter how much money you pump into marketing, it will not make a bad game successful. To the contrary, it can even hurt to market bad games too much as it can upset your existing fans.",
			"translation": "Marketing có thể rất hiệu quả để tiếp cận nhiều khách hàng tiềm năng hơn nhưng cũng có thể rất tốn kém. Tốt nhất là nên thử nghiệm cẩn thận với marketing để có cảm nhận về những gì hoạt động tốt nhất. Đừng đầu tư quá nhiều và hãy nhớ rằng thời điểm rất quan trọng. Đừng đầu tư vào các nỗ lực marketing của bạn quá sớm trong quá trình phát triển hoặc quá muộn.{n}Điều quan trọng nữa là phải biết rằng dù bạn có bơm bao nhiêu tiền vào marketing, nó cũng sẽ không làm cho một trò chơi tồi tệ thành công. Ngược lại, việc marketing quá nhiều cho những trò chơi tồi tệ thậm chí có thể gây hại vì nó có thể làm phật lòng những người hâm mộ hiện tại của bạn."
		}, {
			"value": "Hype points",
			"comment": "heading",
			"translation": "Điểm Hype"
		}, {
			"value": "Developing a great game is not the only recipe for success. It is essential to build hype to ensure that players are excited about your game.{n}In the beginning of your career, hype is mostly generated through random events but once you gain more experience you can use marketing and other strategies to generate hype.",
			"translation": "Phát triển một trò chơi tuyệt vời không phải là công thức duy nhất để thành công. Điều cần thiết là phải tạo dựng sự cường điệu (hype) để đảm bảo người chơi hào hứng với trò chơi của bạn.{n}Khi bắt đầu sự nghiệp, sự cường điệu chủ yếu được tạo ra thông qua các sự kiện ngẫu nhiên nhưng một khi bạn có nhiều kinh nghiệm hơn, bạn có thể sử dụng marketing và các chiến lược khác để tạo ra sự cường điệu."
		}, {
			"value": "Level 2",
			"comment": "heading",
			"translation": "Cấp độ 2"
		}, {
			"value": "You now may also train yourself and your staff to improve skills.\nLet's try this by completing a management course which is required before you can hire your first employee.{n}To get started close this message and then {0} on your character to bring up the training menu.",
			"comment": "{0} click/touch verb",
			"translation": "Bây giờ bạn cũng có thể đào tạo bản thân và nhân viên của mình để cải thiện kỹ năng.\nHãy thử điều này bằng cách hoàn thành một khóa học quản lý, đây là điều kiện bắt buộc trước khi bạn có thể thuê nhân viên đầu tiên của mình.{n}Để bắt đầu, hãy đóng thông báo này và sau đó {0} vào nhân vật của bạn để mở menu đào tạo."
		}, {
			"value": "First engine",
			"comment": "heading",
			"translation": "Engine đầu tiên"
		}, {
			"value": "Congratulations! Your first custom game engine is now ready.\nYou should try using it in your next game.",
			"translation": "Xin chúc mừng! Engine game tùy chỉnh đầu tiên của bạn đã sẵn sàng.\nBạn nên thử sử dụng nó trong trò chơi tiếp theo của mình."
		}, {
			"value": "Finding staff",
			"comment": "heading",
			"translation": "Tìm kiếm nhân viên"
		}, {
			"value": "Before you can hire someone you have to advertise the open position, set an advertising budget and decide how you want to test your applicants.{n}A high budget will increase the number of applicants and the different tests will help find people with the right balance of design and technology skills.",
			"translation": "Trước khi bạn có thể thuê ai đó, bạn phải quảng cáo vị trí tuyển dụng, đặt ngân sách quảng cáo và quyết định cách bạn muốn kiểm tra ứng viên của mình.{n}Ngân sách cao sẽ tăng số lượng ứng viên và các bài kiểm tra khác nhau sẽ giúp tìm ra những người có sự cân bằng phù hợp giữa kỹ năng thiết kế và công nghệ."
		}, {
			"value": "Staff vacation",
			"comment": "heading",
			"translation": "Nhân viên nghỉ phép"
		}, {
			"value": "From time to time your employees need to recharge their batteries and go on vacation. You can tell that an employee is in need of rest when their efficiency steadily decreases.{n}To give them a holiday just {0} on them and select Send on Vacation",
			"comment": "{0} click/touch verb",
			"translation": "Thỉnh thoảng nhân viên của bạn cần nạp lại năng lượng và đi nghỉ. Bạn có thể biết một nhân viên cần nghỉ ngơi khi hiệu quả làm việc của họ giảm dần đều.{n}Để cho họ nghỉ phép, chỉ cần {0} vào họ và chọn Gửi đi nghỉ phép."
		}, {
			"value": "Hiring staff",
			"comment": "heading",
			"translation": "Tuyển dụng nhân viên"
		}, {
			"value": "The search for the open position is complete!\nYou can now review the list of applicants and hire someone for this position.{n}Don't forget that you can always train your employees to improve their skills.",
			"translation": "Việc tìm kiếm vị trí tuyển dụng đã hoàn tất!\nBây giờ bạn có thể xem lại danh sách ứng viên và thuê một người cho vị trí này.{n}Đừng quên rằng bạn luôn có thể đào tạo nhân viên của mình để cải thiện kỹ năng của họ."
		}, {
			"value": "Staff hired",
			"comment": "heading",
			"translation": "Nhân viên đã được thuê"
		}, {
			"value": "Congratulations on your first hire!\nNew employees have to settle in before they become fully effective.\nWhen a character is not fully efficient you can see an efficiency bar next to them. This bar will fill up slowly over time.{n}It is usually a good idea to give your new staff a Welcome training to get them up to speed quickly.\nThis will maximize their efficiency way faster than normally.\nTo do this close this message and then {0} on the character to bring up the action menu.",
			"comment": "{0} click/touch verb",
			"translation": "Chúc mừng bạn đã tuyển dụng được nhân viên đầu tiên!\nNhân viên mới cần thời gian ổn định trước khi họ có thể làm việc hiệu quả hoàn toàn.\nKhi một nhân vật chưa đạt hiệu quả tối đa, bạn có thể thấy một thanh hiệu quả bên cạnh họ. Thanh này sẽ từ từ đầy lên theo thời gian.{n}Thường thì nên cho nhân viên mới của bạn một khóa đào tạo Chào mừng để giúp họ nhanh chóng bắt kịp công việc.\nĐiều này sẽ tối đa hóa hiệu quả của họ nhanh hơn nhiều so với bình thường.\nĐể làm điều này, hãy đóng thông báo này và sau đó {0} vào nhân vật để mở menu hành động."
		}, {
			"value": "Hiring more staff",
			"comment": "heading",
			"translation": "Tuyển thêm nhân viên"
		}, {
			"value": "You can hire up to four employees in this office. Don't try to hire everyone at once as staff are expensive.\nMany rookies hire too early and go bankrupt.\nIt is best to take it slow.",
			"translation": "Bạn có thể thuê tối đa bốn nhân viên trong văn phòng này. Đừng cố gắng thuê tất cả mọi người cùng một lúc vì nhân viên rất tốn kém.\nNhiều người mới vào nghề thuê quá sớm và bị phá sản.\nTốt nhất là nên từ từ."
		}, {
			"value": "Boosts",
			"comment": "heading",
			"translation": "Tăng tốc"
		}, {
			"value": "Boosts are a powerful tool that allow you to temporarily increase the output of your staff.\nThey are most effective when timed strategically during the development of a game or during training.{n}Boosts need to recharge before you can use them. You can activate a boost as soon as the recharge progress is complete but you can also wait a little longer to further increase the effectiveness of the boost.",
			"translation": "Tăng tốc là một công cụ mạnh mẽ cho phép bạn tạm thời tăng năng suất của nhân viên.\nChúng hiệu quả nhất khi được sử dụng một cách chiến lược trong quá trình phát triển game hoặc trong quá trình đào tạo.{n}Tăng tốc cần thời gian hồi phục trước khi bạn có thể sử dụng lại. Bạn có thể kích hoạt tăng tốc ngay khi quá trình hồi phục hoàn tất nhưng bạn cũng có thể đợi thêm một chút để tăng thêm hiệu quả của việc tăng tốc."
		}, {
			"value": "Additional game features",
			"comment": "heading",
			"translation": "Các tính năng game bổ sung"
		}, {
			"value": "During development you can also select additional features for your game. Right now you can only pick 'Basic Sounds' but your options will increase quickly. Selecting additional features makes the game generally better but also increases its cost.{n}You will also see the graphic type you selected when you defined the game. This is just to remind you of your choice. You cannot change the type of graphics mid-game.",
			"translation": "Trong quá trình phát triển, bạn cũng có thể chọn các tính năng bổ sung cho trò chơi của mình. Hiện tại bạn chỉ có thể chọn 'Âm thanh Cơ bản' nhưng các tùy chọn của bạn sẽ tăng lên nhanh chóng. Việc chọn các tính năng bổ sung thường làm cho trò chơi tốt hơn nhưng cũng làm tăng chi phí của nó.{n}Bạn cũng sẽ thấy loại đồ họa bạn đã chọn khi xác định trò chơi. Điều này chỉ để nhắc bạn về lựa chọn của mình. Bạn không thể thay đổi loại đồ họa giữa chừng."
		}, {
			"value": "Finishing phase",
			"comment": "heading",
			"translation": "Giai đoạn hoàn thiện"
		}, {
			"value": "The development of your first game is now complete. You can press the 'Finish' button to publish your game but you should only do that once you fix the majority of bugs.{n}Releasing a game without fixing bugs can severely affect your ratings so you should only ever consider that if you need the cash and you can't afford to wait.",
			"translation": "Quá trình phát triển trò chơi đầu tiên của bạn hiện đã hoàn tất. Bạn có thể nhấn nút 'Hoàn thành' để phát hành trò chơi của mình nhưng bạn chỉ nên làm điều đó sau khi đã sửa phần lớn lỗi.{n}Việc phát hành một trò chơi mà không sửa lỗi có thể ảnh hưởng nghiêm trọng đến xếp hạng của bạn, vì vậy bạn chỉ nên cân nhắc điều đó nếu bạn cần tiền và không thể đợi được."
		}, {
			"value": "Training",
			"comment": "heading",
			"translation": "Đào tạo"
		}, {
			"value": "If you want to create hit-games and have a world class team then training is important.\n For best results train your staff regularly but don't overwhelm them with too many sessions at once.{n}There are different training options available.\nSome options are better to increase certain skills than others. Experimenting is the best way to figure out which training options fit your plans.\nIt is useful to have a mix of 'specialists' and allrounders in your team but aim to have at least one design specialist and technology specialist.",
			"translation": "Nếu bạn muốn tạo ra những trò chơi bom tấn và có một đội ngũ đẳng cấp thế giới thì việc đào tạo rất quan trọng.\nĐể có kết quả tốt nhất, hãy đào tạo nhân viên của bạn thường xuyên nhưng đừng làm họ quá tải với quá nhiều buổi học cùng một lúc.{n}Có nhiều lựa chọn đào tạo khác nhau.\nMột số lựa chọn tốt hơn để tăng cường các kỹ năng nhất định so với những lựa chọn khác. Thử nghiệm là cách tốt nhất để tìm ra lựa chọn đào tạo nào phù hợp với kế hoạch của bạn.\nViệc có một đội ngũ kết hợp giữa 'chuyên gia' và những người đa năng là hữu ích, nhưng hãy đặt mục tiêu có ít nhất một chuyên gia thiết kế và một chuyên gia công nghệ."
		}, {
			"value": "Level 5 unlocks",
			"comment": "heading",
			"translation": "Mở khóa cấp 5"
		}, {
			"value": "Someone on your team has reached experience level 5! This unlocks a special training item called Boost. The training for it is expensive and you can only do it once the character has at least 500 design or technology points but the investment is well worth it.{n}Once trained, the boost allows you to temporarily increase the output of your staff and can really help you to make a hit-game.",
			"translation": "Ai đó trong đội của bạn đã đạt cấp độ kinh nghiệm 5! Điều này mở khóa một vật phẩm đào tạo đặc biệt gọi là Tăng tốc. Việc đào tạo cho nó rất tốn kém và bạn chỉ có thể thực hiện một lần khi nhân vật có ít nhất 500 điểm thiết kế hoặc công nghệ nhưng sự đầu tư này rất xứng đáng.{n}Sau khi được đào tạo, tăng tốc cho phép bạn tạm thời tăng năng suất của nhân viên và thực sự có thể giúp bạn tạo ra một trò chơi bom tấn."
		}, {
			"value": "Publishers",
			"comment": "heading",
			"translation": "Nhà phát hành"
		}, {
			"value": "Using a publisher is a great way to get your games in front of a large audience which in turns helps to grow your fan base.\nOnce your fan base is big enough you can self-publish your larger games without the need for a publisher.\nFor medium games you should aim to have at least 100K fans before you publish them yourself.{n}To use a publisher you need to sign a contract. The contract will dictate what game you need to create. Pay attention to all the details, most importantly the minimum score that the contract dictates. If the game you release does not meet the minimum score you will have to pay a penalty, which can be costly.{n}It is also important to pay attention to the royalty rate. The higher the rate the more money you will make from the contract.",
			"translation": "Sử dụng nhà phát hành là một cách tuyệt vời để đưa trò chơi của bạn đến với đông đảo khán giả, điều này giúp tăng lượng người hâm mộ của bạn.\nKhi lượng người hâm mộ của bạn đủ lớn, bạn có thể tự phát hành các trò chơi lớn hơn của mình mà không cần nhà phát hành.\nĐối với các trò chơi cỡ vừa, bạn nên đặt mục tiêu có ít nhất 100 nghìn người hâm mộ trước khi tự mình phát hành chúng.{n}Để sử dụng nhà phát hành, bạn cần ký hợp đồng. Hợp đồng sẽ quy định bạn cần tạo trò chơi nào. Hãy chú ý đến tất cả các chi tiết, quan trọng nhất là điểm số tối thiểu mà hợp đồng quy định. Nếu trò chơi bạn phát hành không đạt điểm số tối thiểu, bạn sẽ phải trả tiền phạt, điều này có thể rất tốn kém.{n}Điều quan trọng nữa là phải chú ý đến tỷ lệ tiền bản quyền. Tỷ lệ càng cao, bạn càng kiếm được nhiều tiền từ hợp đồng."
		}, {
			"value": "Design specialist",
			"comment": "heading",
			"translation": "Chuyên gia thiết kế"
		}, {
			"value": "R&D lab is ready",
			"comment": "heading",
			"translation": "Phòng R&D đã sẵn sàng"
		}, {
			"value": "To start a project simply {0} the screen to bring up the research menu.\nOnce you start a project you can also cancel it using the same menu.",
			"comment": "{0} click/touch verb",
			"translation": "Để bắt đầu một dự án, chỉ cần {0} vào màn hình để mở menu nghiên cứu.\nKhi bạn bắt đầu một dự án, bạn cũng có thể hủy bỏ nó bằng cùng một menu."
		}, {
			"value": "Hardware lab is ready",
			"comment": "heading",
			"translation": "Phòng thí nghiệm phần cứng đã sẵn sàng"
		}, {
			"value": "R&D project started",
			"comment": "heading",
			"translation": "Dự án R&D đã bắt đầu"
		}, {
			"value": "The project is now started and as your researchers work on it you will see the progress in the status card. Don't forget to adjust the budget! If the budget is 0 the project will never progress.",
			"translation": "Dự án hiện đã bắt đầu và khi các nhà nghiên cứu của bạn làm việc với nó, bạn sẽ thấy tiến độ trong thẻ trạng thái. Đừng quên điều chỉnh ngân sách! Nếu ngân sách bằng 0, dự án sẽ không bao giờ tiến triển."
		}, {
			"value": "Console Development",
			"translation": "Phát triển Console"
		}, {
			"value": "Developing your own console is a very costly undertaking. Not only do you have to pay a big chunk of money up front for the project but you will also have to pay your hardware lab crew. Only attempt to create a console if you are confident that you have enough capital.{n}When developing a console you can decide on how your console will look like and decide on the technical features as well as the quality assurance budget. The more sophisticated your technology is the better the console will fare against competing products. The more budget you reserve for QA the better the quality of your console will be.",
			"translation": "Phát triển console của riêng bạn là một công việc rất tốn kém. Bạn không chỉ phải trả một khoản tiền lớn ban đầu cho dự án mà còn phải trả lương cho đội ngũ phòng thí nghiệm phần cứng của mình. Chỉ nên cố gắng tạo console nếu bạn tự tin rằng mình có đủ vốn.{n}Khi phát triển console, bạn có thể quyết định giao diện của console, các tính năng kỹ thuật cũng như ngân sách đảm bảo chất lượng. Công nghệ của bạn càng tinh vi, console càng có khả năng cạnh tranh tốt hơn với các sản phẩm đối thủ. Ngân sách bạn dành cho QA càng nhiều, chất lượng console của bạn càng tốt."
		}, {
			"value": "Console released",
			"comment": "heading",
			"translation": "Console đã phát hành"
		}, {
			"value": "Your very own game console is now on the market. Game consoles are complex machines and when you sell a lot of them it is only natural that some of them need to be repaired.{n}While your console is on sale your hardware team will have to work off maintenance points. Depending on the quality of the console and how many you sell these points vary from week to week.{n}Try to give your hardware lab enough budget so that they stay on top of the maintenance, otherwise customers will become unhappy when they have to wait too long for their consoles to be repaired. You can see how well your team is doing in the console information card in the top left of the screen.",
			"translation": "Hệ máy chơi game của riêng bạn hiện đã có mặt trên thị trường. Máy chơi game là những cỗ máy phức tạp và khi bạn bán được nhiều, việc một số máy cần sửa chữa là điều tự nhiên.{n}Trong khi hệ máy của bạn đang được bán, đội ngũ phần cứng của bạn sẽ phải làm việc để giải quyết các điểm bảo trì. Tùy thuộc vào chất lượng của hệ máy và số lượng bạn bán được, các điểm này sẽ thay đổi theo từng tuần.{n}Hãy cố gắng cung cấp đủ ngân sách cho phòng thí nghiệm phần cứng của bạn để họ có thể theo kịp việc bảo trì, nếu không khách hàng sẽ không hài lòng khi phải đợi quá lâu để sửa chữa hệ máy của họ. Bạn có thể xem đội ngũ của mình hoạt động tốt như thế nào trong thẻ thông tin console ở góc trên bên trái màn hình."
		}, {
			"value": "MMO on sale",
			"comment": "heading",
			"translation": "MMO đang bán"
		}, {
			"value": "Your MMO is on sale now. MMOs work slightly different than normal games. MMOs not only generate income but also cause maintenance costs as we need to run game servers and provide customer services. You will see the amount of maintenance paid in the sales card.{n}Unlike other games which have a limited sales duration MMOs sell indefinitely. You will have to decide yourself when you want to take an MMO off the market. To take an MMO off the market simply {0} on the sales card to bring up a menu.{n}Since MMOs are so expensive to create you might want to try to expand your current MMO rather than create a new one. To do this you will need to create a expansion pack, which you can start to research now.",
			"translation": "MMO của bạn hiện đang được bán. MMO hoạt động hơi khác so với các trò chơi thông thường. MMO không chỉ tạo ra thu nhập mà còn gây ra chi phí bảo trì vì chúng ta cần vận hành máy chủ trò chơi và cung cấp dịch vụ khách hàng. Bạn sẽ thấy số tiền bảo trì được thanh toán trong thẻ bán hàng.{n}Không giống như các trò chơi khác có thời gian bán hàng hạn chế, MMO được bán vô thời hạn. Bạn sẽ phải tự quyết định khi nào muốn ngừng bán một MMO. Để ngừng bán một MMO, chỉ cần {0} vào thẻ bán hàng để mở menu.{n}Vì MMO rất tốn kém để tạo ra, bạn có thể muốn thử mở rộng MMO hiện tại của mình thay vì tạo một MMO mới. Để làm điều này, bạn sẽ cần tạo một gói mở rộng, mà bạn có thể bắt đầu nghiên cứu ngay bây giờ."
		}, {
			"value": "Additional Specialists",
			"comment": "heading",
			"translation": "Chuyên gia Bổ sung"
		}, {
			"value": "While you only need one specialist to start running a lab you can train more than one. Additional specialists decrease the overall running cost of your lab.",
			"translation": "Mặc dù bạn chỉ cần một chuyên gia để bắt đầu vận hành phòng thí nghiệm, bạn có thể đào tạo nhiều hơn một người. Các chuyên gia bổ sung sẽ giảm chi phí vận hành tổng thể của phòng thí nghiệm của bạn."
		}, {
			"value": "Finish",
			"comment": "button",
			"translation": "Hoàn thành"
		}, {
			"value": "Fill Position",
			"translation": "Tuyển dụng"
		}, {
			"value": "Hint",
			"translation": "Gợi ý"
		}, {
			"value": "You have to complete the Staff Management training before you can hire someone. Simply {0} on your player character to access the training menu.",
			"translation": "Bạn phải hoàn thành khóa đào tạo Quản lý Nhân viên trước khi có thể thuê ai đó. Chỉ cần {0} vào nhân vật người chơi của bạn để truy cập menu đào tạo."
		}, {
			"value": "{0} per month",
			"translation": "{0} mỗi tháng"
		}, {
			"value": "Small Booth",
			"comment": "heading",
			"translation": "Gian hàng Nhỏ"
		}, {
			"value": "This is a small pop up stand where we can show our marketing material. It isn't very impressive but a common setup at the G3.",
			"translation": "Đây là một gian hàng nhỏ dạng pop-up nơi chúng ta có thể trưng bày tài liệu marketing của mình. Nó không ấn tượng lắm nhưng là một kiểu thiết lập phổ biến tại G3."
		}, {
			"value": "Medium Booth",
			"comment": "heading",
			"translation": "Gian hàng Vừa"
		}, {
			"value": "This is a larger booth in a better location. We should expect more visitors with this booth and have space to give away demos of our games.",
			"translation": "Đây là một gian hàng lớn hơn ở vị trí tốt hơn. Chúng ta nên mong đợi nhiều khách tham quan hơn với gian hàng này và có không gian để tặng bản demo trò chơi của chúng ta."
		}, {
			"value": "Large Booth",
			"comment": "heading",
			"translation": "Gian hàng Lớn"
		}, {
			"value": "With this package we get our own section in the main hall of the G3. We can expect a large number of visitors.",
			"translation": "Với gói này, chúng ta sẽ có khu vực riêng trong sảnh chính của G3. Chúng ta có thể mong đợi một lượng lớn khách tham quan."
		}, {
			"value": "Custom",
			"comment": "heading, as in Custom Booth",
			"translation": "Tùy chỉnh"
		}, {
			"value": "Game #",
			"comment": "followed by number",
			"translation": "Game #"
		}, {
			"value": "Action",
			"comment": "genre",
			"translation": "Hành động"
		}, {
			"value": "Adventure",
			"comment": "genre",
			"translation": "Phiêu lưu"
		}, {
			"value": "RPG",
			"comment": "genre",
			"translation": "Nhập vai"
		}, {
			"value": "Simulation",
			"comment": "genre",
			"translation": "Mô phỏng"
		}, {
			"value": "Strategy",
			"comment": "genre",
			"translation": "Chiến thuật"
		}, {
			"value": "Casual",
			"comment": "genre",
			"translation": "Phổ thông"
		},
		{
			"value": "Visual Novel",
			"comment": "genre",
			"translation": "Visual Novel"
		},
		{
			"value": "Sandbox",
			"comment": "genre",
			"translation": "Thế giới mở"
		},
		{
			"value": "MOBA",
			"comment": "genre",
			"translation": "MOBA"
		},
		{
			"value": "Battle Royale",
			"comment": "genre",
			"translation": "Battle Royale"
		},
		{
			"value": "Racing",
			"comment": "genre",
			"translation": "Đua xe"
		},
		{
			"value": "Take off market",
			"comment": "menu item",
			"translation": "Ngừng bán"
		}, {
			"value": "Develop patch ({0})",
			"comment": "menu item",
			"translation": "Phát triển bản vá ({0})"
		}, {
			"value": "Research...",
			"comment": "menu item",
			"translation": "Nghiên cứu..."
		}, {
			"value": "Train...",
			"comment": "menu item",
			"translation": "Đào tạo..."
		}, {
			"value": "Send on Vacation",
			"comment": "menu item",
			"translation": "Cho đi nghỉ"
		}, {
			"value": "Fire...",
			"comment": "menu item",
			"translation": "Sa thải..."
		}, {
			"value": "Marketing...",
			"comment": "menu item",
			"translation": "Marketing..."
		}, {
			"value": "Develop New Game...",
			"comment": "menu item",
			"translation": "Phát triển Game Mới..."
		}, {
			"value": "Develop Sequel...",
			"comment": "menu item",
			"translation": "Phát triển Phần tiếp theo..."
		}, {
			"value": "Develop Expansion Pack...",
			"comment": "menu item",
			"translation": "Phát triển Gói Mở rộng..."
		}, {
			"value": "Create Custom Engine...",
			"comment": "menu item",
			"translation": "Tạo Engine Tùy chỉnh..."
		}, {
			"value": "Find Contract Work...",
			"comment": "menu item",
			"translation": "Tìm Hợp đồng..."
		}, {
			"value": "Find Publishing Deal...",
			"comment": "menu item",
			"translation": "Tìm Thỏa thuận Phát hành..."
		}, {
			"value": "Staff List...",
			"comment": "menu item",
			"translation": "Danh sách Nhân viên..."
		}, {
			"value": "Game History...",
			"comment": "menu item",
			"translation": "Lịch sử Game..."
		}, {
			"value": "Cancel Project...",
			"comment": "menu item",
			"translation": "Hủy Dự án..."
		}, {
			"value": "Start Project...",
			"comment": "menu item",
			"translation": "Bắt đầu Dự án..."
		}, {
			"value": "Develop Console...",
			"comment": "menu item",
			"translation": "Phát triển Console..."
		}, {
			"value": "Previously shown tutorial messages for the active game are shown here. To see tutorial messages here, please continue an existing game or start a new one. You can start a new game via the app bar.",
			"translation": "Các thông báo hướng dẫn đã hiển thị trước đó cho trò chơi đang hoạt động được hiển thị ở đây. Để xem các thông báo hướng dẫn ở đây, vui lòng tiếp tục một trò chơi hiện có hoặc bắt đầu một trò chơi mới. Bạn có thể bắt đầu một trò chơi mới thông qua thanh ứng dụng."
		}, {
			"value": "Pick Topic",
			"comment": "button",
			"translation": "Chọn Chủ đề"
		}, {
			"value": "Pick Platform",
			"comment": "button",
			"translation": "Chọn Nền tảng"
		}, {
			"value": "Dev. cost: ",
			"translation": "Chi phí P.triển: "
		}, {
			"value": "License cost: ",
			"translation": "Phí bản quyền: "
		}, {
			"value": "Marketshare: ",
			"translation": "Thị phần: "
		}, {
			"value": "Pick Genre",
			"comment": "heading",
			"translation": "Chọn Thể loại"
		}, {
			"value": "Pick Engine",
			"comment": "heading",
			"translation": "Chọn Engine"
		}, {
			"value": "The big game convention will take place in four weeks time. Do you want to participate?",
			"translation": "Hội chợ game lớn sẽ diễn ra trong bốn tuần nữa. Bạn có muốn tham gia không?"
		}, {
			"value": "Costs: {0}",
			"translation": "Chi phí: {0}"
		}, {
			"value": "Game Convention: G3",
			"comment": "heading",
			"translation": "Hội chợ Game: G3"
		}, {
			"value": "{0} Convention",
			"comment": "heading",
			"translation": "Hội chợ {0}"
		}, {
			"value": "Console Name",
			"translation": "Tên Console"
		}, {
			"value": "{0} costs",
			"translation": "Chi phí {0}"
		}, {
			"value": "Backlog: {0}",
			"translation": "Tồn đọng: {0}"
		}, {
			"value": "{0} not researched",
			"translation": "{0} chưa được nghiên cứu"
		}, {
			"value": "Min Score: {0}",
			"translation": "Điểm tối thiểu: {0}"
		}, {
			"value": "Game Size:",
			"translation": "Quy mô Game:"
		}, {
			"value": "Target Audience:",
			"translation": "Đối tượng mục tiêu:"
		}, {
			"value": "Royalties: {0}%",
			"translation": "Tiền bản quyền: {0}%"
		}, {
			"value": "Up-front Pay: {0}",
			"translation": "Trả trước: {0}"
		}, {
			"value": "Penalty: {0}",
			"translation": "Tiền phạt: {0}"
		}, {
			"value": " (no license)",
			"translation": " (chưa có giấy phép)"
		}, {
			"value": "Pay: {0}",
			"translation": "Thanh toán: {0}"
		}, {
			"value": "{0} weeks",
			"translation": "{0} tuần"
		}, {
			"value": "There are no contracts currently available.",
			"translation": "Hiện tại không có hợp đồng nào."
		}, {
			"value": "Development Stage {0}",
			"translation": "Giai đoạn Phát triển {0}"
		}, {
			"value": "{0} Lvl. {1}",
			"comment": "{0} feature name, {1} lvl number",
			"translation": "{0} Cấp {1}"
		}, {
			"value": "Cost: {0}",
			"translation": "Chi phí: {0}"
		}, {
			"value": "Drag staff here",
			"translation": "Kéo nhân viên vào đây"
		}, {
			"value": "Design: ",
			"translation": "Thiết kế: "
		}, {
			"value": "Tech.: ",
			"translation": "Công nghệ: "
		}, {
			"value": "Dev. stage {0}",
			"translation": "Giai đoạn PT {0}"
		}, {
			"value": "Game Engine #{0}",
			"comment": "{0} is number",
			"translation": "Engine Game #{0}"
		}, {
			"value": "Sequel to {0}",
			"translation": "Phần tiếp theo của {0}"
		}, {
			"value": "Game Concept",
			"translation": "Ý tưởng Game"
		}, {
			"value": "{0} does not support {1} games!",
			"comment": "{0} platform, {1} game size",
			"translation": "{0} không hỗ trợ game {1}!"
		}, {
			"value": "MMO's cannot be small or medium.",
			"translation": "MMO không thể có quy mô nhỏ hoặc vừa."
		}, {
			"value": "Engine does not support MMO.",
			"translation": "Engine không hỗ trợ MMO."
		}, {
			"value": "Most expensive ({0}): {1}",
			"translation": "Đắt nhất ({0}): {1}"
		}, {
			"value": "Most profitable ({0}): {1}",
			"translation": "Lợi nhuận cao nhất ({0}): {1}"
		}, {
			"value": "Least profitable ({0}): {1}",
			"translation": "Lợi nhuận thấp nhất ({0}): {1}"
		}, {
			"value": "Most used topic ({0}): {1}",
			"translation": "Chủ đề dùng nhiều nhất ({0}): {1}"
		}, {
			"value": "Most used genre ({0}): {1}",
			"translation": "Thể loại dùng nhiều nhất ({0}): {1}"
		}, {
			"value": "Researched topics: {0}",
			"translation": "Chủ đề đã nghiên cứu: {0}"
		}, {
			"value": "Total research completed: {0}",
			"translation": "Tổng nghiên cứu đã hoàn thành: {0}"
		}, {
			"value": "Design points generated: {0}",
			"translation": "Điểm thiết kế đã tạo: {0}"
		}, {
			"value": "Technology points generated: {0}",
			"translation": "Điểm công nghệ đã tạo: {0}"
		}, {
			"value": "Small games: {0}",
			"translation": "Game nhỏ: {0}"
		}, {
			"value": "Medium games: {0}",
			"translation": "Game vừa: {0}"
		}, {
			"value": "Large games: {0}",
			"translation": "Game lớn: {0}"
		}, {
			"value": "AAA games: {0}",
			"translation": "Game AAA: {0}"
		}, {
			"value": "Good games: {0}",
			"translation": "Game hay: {0}"
		}, {
			"value": "Top hits: {0}",
			"translation": "Top game nổi tiếng: {0}"
		}, {
			"value": "Publishers used: {0}",
			"translation": "Nhà phát hành đã dùng: {0}"
		}, {
			"value": "Self-published games: {0}",
			"translation": "Game tự phát hành: {0}"
		}, {
			"value": "Best seller: {0} ({1} units)",
			"translation": "Bán chạy nhất: {0} ({1} bản)"
		}, {
			"value": "Fans: {0}",
			"translation": "Người hâm mộ: {0}"
		}, {
			"value": "Cash: {0}",
			"translation": "Tiền mặt: {0}"
		}, {
			"value": "Custom consoles: {0}",
			"translation": "Console tùy chỉnh: {0}"
		}, {
			"value": "It seems that something went wrong when purchasing the app.\nPlease close the app and try again later.\n If the issue persists please contact\n\n{0}",
			"translation": "Có vẻ đã xảy ra lỗi khi mua ứng dụng.\nVui lòng đóng ứng dụng và thử lại sau.\nNếu sự cố vẫn tiếp diễn, vui lòng liên hệ\n\n{0}"
		}, {
			"value": "Store Confirmation Error",
			"comment": "heading",
			"translation": "Lỗi Xác nhận Cửa hàng"
		}, {
			"value": "It seems that something went wrong when trying to purchase the app.\nThis usually indicates a problem with the Store. Please try again later and if the issue persists please contact\n\n{0}",
			"translation": "Có vẻ đã xảy ra lỗi khi cố gắng mua ứng dụng.\nĐiều này thường cho thấy có vấn đề với Cửa hàng. Vui lòng thử lại sau và nếu sự cố vẫn tiếp diễn, vui lòng liên hệ\n\n{0}"
		}, {
			"value": "Store Error",
			"comment": "heading",
			"translation": "Lỗi Cửa hàng"
		}, {
			"value": "It seems that something went wrong when trying to go to the Store page for the full app.\nPlease try again and if the issue persists please contact {0} or search for Game Dev Tycoon manually on the Windows Store.",
			"translation": "Có vẻ đã xảy ra lỗi khi cố gắng truy cập trang Cửa hàng cho ứng dụng đầy đủ.\nVui lòng thử lại và nếu sự cố vẫn tiếp diễn, vui lòng liên hệ {0} hoặc tìm kiếm Game Dev Tycoon theo cách thủ công trên Windows Store."
		}, {
			"value": "You have reached the end of the {0} version.\nIf you like what you've seen so far then you should definitely check out the full game. You can find a brief description of what awaits you below.",
			"translation": "Bạn đã hoàn thành phiên bản {0}.\nNếu bạn thích những gì đã trải nghiệm, bạn chắc chắn nên xem thử phiên bản đầy đủ. Bạn có thể tìm thấy mô tả ngắn gọn về những gì đang chờ đợi bạn bên dưới."
		}, {
			"value": "\n\n<strong>If you unlock the full game you can continue playing the game you've already started.</strong>",
			"translation": "\n\n<strong>Nếu bạn mở khóa phiên bản đầy đủ, bạn có thể tiếp tục chơi trò chơi bạn đã bắt đầu.</strong>"
		}, {
			"value": "Go to full game ...",
			"translation": "Đến bản đầy đủ ..."
		}, {
			"value": " Unlock full game ...",
			"translation": " Mở khóa bản đầy đủ ..."
		}, {
			"value": "Cash",
			"translation": "Tiền mặt"
		}, {
			"value": "Total fans",
			"translation": "Tổng số người hâm mộ"
		}, {
			"value": "Total game releases",
			"translation": "Tổng số game đã phát hành"
		}, {
			"value": "Total unit sales",
			"translation": "Tổng số bản đã bán"
		}, {
			"value": "Total design points generated",
			"translation": "Tổng điểm thiết kế đã tạo"
		}, {
			"value": "Total technology points generated",
			"translation": "Tổng điểm công nghệ đã tạo"
		}, {
			"value": "Total research completed",
			"translation": "Tổng nghiên cứu đã hoàn thành"
		}, {
			"value": "Most sales ({0})",
			"translation": "Doanh thu cao nhất ({0})"
		}, {
			"value": "Most fans ({0})",
			"translation": "Nhiều fan nhất ({0})"
		}, {
			"value": "Most expensive ({0})",
			"translation": "Đắt nhất ({0})"
		}, {
			"value": "Most profitable ({0})",
			"translation": "Lợi nhuận cao nhất ({0})"
		}, {
			"value": "Least profitable ({0})",
			"translation": "Lợi nhuận thấp nhất ({0})"
		}, {
			"value": "Most used topic ({0})",
			"translation": "Chủ đề dùng nhiều nhất ({0})"
		}, {
			"value": "Most used genre ({0})",
			"translation": "Thể loại dùng nhiều nhất ({0})"
		}, {
			"value": "Thank you for playing the {0} version.\nIf you like what you've seen so far then you should definitely check out the full game.",
			"translation": "Cảm ơn bạn đã chơi phiên bản {0}.\nNếu bạn thích những gì đã trải nghiệm, bạn chắc chắn nên xem thử phiên bản đầy đủ."
		}, {
			"value": "If you unlock the full game you can continue playing the game you've already started.",
			"translation": "Nếu bạn mở khóa phiên bản đầy đủ, bạn có thể tiếp tục chơi trò chơi bạn đã bắt đầu."
		}, {
			"value": "coming soon",
			"translation": "sắp ra mắt"
		}, {
			"value": "Y{0} M{1} W{2}",
			"comment": "date display",
			"translation": "N{0} T{1} Tu{2}"
		}, {
			"value": "Loss:",
			"translation": "Lỗ:"
		}, {
			"value": "Select Game",
			"comment": "heading",
			"translation": "Chọn Game"
		}, {
			"value": "Game History",
			"translation": "Lịch sử Game"
		}, {
			"value": "Select",
			"comment": "button",
			"translation": "Chọn"
		}, {
			"value": "Company Name",
			"translation": "Tên Công ty"
		}, {
			"value": "Player Name",
			"translation": "Tên Người chơi"
		}, {
			"value": "Auto",
			"translation": "Tự động"
		}, {
			"value": "Slot ",
			"translation": "Ô lưu "
		}, {
			"value": "Rank: ",
			"translation": "Hạng: "
		}, {
			"value": "Units: ",
			"translation": "Số bản: "
		}, {
			"value": "No scores yet. Once you finish a game your high score will be listed here.",
			"translation": "Chưa có điểm số nào. Sau khi bạn hoàn thành một trò chơi, điểm cao của bạn sẽ được liệt kê ở đây."
		}, {
			"value": "How do you want to market {0}?",
			"translation": "Bạn muốn quảng bá {0} như thế nào?"
		}, {
			"value": "Today the new game platform {0} by {1} has been released.",
			"translation": "Hôm nay, nền tảng game mới {0} của {1} đã được phát hành."
		}, {
			"value": "Project Size: ",
			"translation": "Quy mô Dự án: "
		}, {
			"value": "New Topic",
			"translation": "Chủ đề Mới"
		}, {
			"value": "New Combo",
			"translation": "Kết hợp Mới"
		}, {
			"value": "Good Management",
			"translation": "Quản lý Tốt"
		}, {
			"value": "(Bonus: x{0} - {1})",
			"comment": "{0} bonusMultiplier, {1} label",
			"translation": "(Thưởng: x{0} - {1})"
		}, {
			"value": "Lvl. ",
			"translation": "Cấp "
		}, {
			"value": "Due to increase in experience the following staff have earned a raise:",
			"translation": "Do tăng kinh nghiệm, các nhân viên sau đã được tăng lương:"
		}, {
			"value": "Salary increase",
			"comment": "heading",
			"translation": "Tăng lương"
		}, {
			"value": "Special training available for:",
			"translation": "Đào tạo đặc biệt có sẵn cho:"
		}, {
			"value": "Special training",
			"comment": "heading",
			"translation": "Đào tạo đặc biệt"
		}, {
			"value": "What do you want to research?",
			"translation": "Bạn muốn nghiên cứu gì?"
		}, {
			"value": "Training Options",
			"comment": "heading",
			"translation": "Tùy chọn Đào tạo"
		}, {
			"value": "Start Research",
			"comment": "button",
			"translation": "Bắt đầu Nghiên cứu"
		}, {
			"value": "Start Training",
			"comment": "button",
			"translation": "Bắt đầu Đào tạo"
		}, {
			"value": "RP",
			"comment": "RP short for research points",
			"translation": "ĐNC"
		}, {
			"value": "cr.",
			"comment": "cr. short for credits",
			"translation": "cr."
		}, {
			"value": "Reviews for {0}",
			"translation": "Đánh giá cho {0}"
		}, {
			"value": "Complex Algorithms",
			"translation": "Thuật toán Phức tạp"
		}, {
			"value": "Game Demo",
			"translation": "Bản Demo Game"
		}, {
			"value": "Showreel",
			"translation": "Video Giới thiệu"
		}, {
			"value": "Searching...",
			"comment": "button",
			"translation": "Đang tìm kiếm..."
		}, {
			"value": "Find Staff",
			"comment": "heading",
			"translation": "Tìm Nhân viên"
		}, {
			"value": "Cost: ",
			"translation": "Chi phí: "
		}, {
			"value": "Level: ",
			"translation": "Cấp độ: "
		}, {
			"value": "fans",
			"translation": "người hâm mộ"
		}, {
			"value": "{0} Fans",
			"translation": "{0} Người hâm mộ"
		}, {
			"value": " ({0}) - purchased!",
			"translation": " ({0}) - đã mua!"
		}, {
			"value": "No project",
			"translation": "Chưa có dự án"
		}, {
			"value": "Design",
			"translation": "Thiết kế"
		}, {
			"value": "Technology",
			"translation": "Công nghệ"
		}, {
			"value": "Bugs",
			"translation": "Lỗi"
		}, {
			"value": "Remaining",
			"comment": "label for visual which shows 'points remaining'",
			"translation": "Còn lại"
		}, {
			"value": "Custom Game Engine",
			"translation": "Engine Game Tùy chỉnh"
		}, {
			"value": "Contract",
			"translation": "Hợp đồng"
		}, {
			"value": "Time Left",
			"comment": "label for progressbar",
			"translation": "Thời gian còn lại"
		}, {
			"value": "No Project",
			"translation": "Chưa có Dự án"
		}, {
			"value": "Hype {0}",
			"comment": "hype {0} points",
			"translation": "Hype {0}"
		}, {
			"value": "High score",
			"translation": "Điểm cao"
		}, {
			"value": "New",
			"translation": "Mới"
		}, {
			"value": "Save",
			"translation": "Lưu"
		}, {
			"value": "Load",
			"translation": "Tải"
		}, {
			"value": "High Score",
			"translation": "Điểm Cao"
		}, {
			"value": "Paused",
			"translation": "Đã tạm dừng"
		}, {
			"value": "Saving...",
			"translation": "Đang lưu..."
		}, {
			"value": "Go full screen to play!",
			"translation": "Chuyển sang toàn màn hình để chơi!"
		}, {
			"value": "Budget",
			"translation": "Ngân sách"
		}, {
			"value": "Choose",
			"translation": "Chọn"
		}, {
			"value": "Game is finished!",
			"translation": "Game đã hoàn thành!"
		}, {
			"value": "Small",
			"comment": "game size",
			"translation": "Nhỏ"
		}, {
			"value": "Medium",
			"comment": "game size",
			"translation": "Vừa"
		}, {
			"value": "Large",
			"comment": "game size",
			"translation": "Lớn"
		}, {
			"value": "AAA",
			"comment": "game size",
			"translation": "AAA"
		}, {
			"value": "Y",
			"comment": "target audience button content, Y as in young",
			"translation": "Trẻ"
		}, {
			"value": "E",
			"comment": "target audience button content, E as in everyone",
			"translation": "Mọi lứa tuổi"
		}, {
			"value": "M",
			"comment": "target audience button content, M as in mature",
			"translation": "Trưởng thành"
		}, {
			"value": "Pick Game Engine",
			"translation": "Chọn Engine Game"
		}, {
			"value": "Next",
			"translation": "Tiếp theo"
		}, {
			"value": "Feature Selection",
			"translation": "Chọn Tính năng"
		}, {
			"value": "Start Development",
			"translation": "Bắt đầu Phát triển"
		}, {
			"value": "Company Details",
			"translation": "Chi tiết Công ty"
		}, {
			"value": "Continue",
			"translation": "Tiếp tục"
		}, {
			"value": "Load Game",
			"translation": "Tải Game"
		}, {
			"value": "Choose Save Slot",
			"translation": "Chọn Ô Lưu"
		}, {
			"value": "Level:",
			"translation": "Cấp độ:"
		}, {
			"value": "Design:",
			"translation": "Thiết kế:"
		}, {
			"value": "Technology:",
			"translation": "Công nghệ:"
		}, {
			"value": "Speed:",
			"translation": "Tốc độ:"
		}, {
			"value": "Research:",
			"translation": "Nghiên cứu:"
		}, {
			"value": "Create a new Engine",
			"translation": "Tạo Engine mới"
		}, {
			"value": "Create Engine",
			"translation": "Tạo Engine"
		}, {
			"value": "Quality Assurance Budget",
			"translation": "Ngân sách Đảm bảo Chất lượng"
		}, {
			"value": "Special Project",
			"translation": "Dự án Đặc biệt"
		}, {
			"value": "Start Project",
			"translation": "Bắt đầu Dự án"
		}, {
			"value": "Time Allocation (Preview)",
			"translation": "Phân bổ Thời gian (Xem trước)"
		}, {
			"value": "Selected Features",
			"translation": "Các Tính năng Đã chọn"
		}, {
			"value": "Staff",
			"translation": "Nhân viên"
		}, {
			"value": "New Record!",
			"translation": "Kỷ lục Mới!"
		}, {
			"value": "Experience gained",
			"translation": "Kinh nghiệm nhận được"
		}, {
			"value": "XP Bonus:",
			"translation": "Thưởng XP:"
		}, {
			"value": "Release Game",
			"translation": "Phát hành Game"
		}, {
			"value": "Trash Game",
			"translation": "Bỏ Game"
		}, {
			"value": "Level Up!",
			"translation": "Lên cấp!"
		}, {
			"value": "Units Sold:",
			"translation": "Số bản đã bán:"
		}, {
			"value": "Costs:",
			"translation": "Chi phí:"
		}, {
			"value": "Income:",
			"translation": "Thu nhập:"
		}, {
			"value": "Profit:",
			"translation": "Lợi nhuận:"
		}, {
			"value": "Released:",
			"translation": "Phát hành:"
		}, {
			"value": "Fans:",
			"translation": "Người hâm mộ:"
		}, {
			"value": "Avg. Review Score:",
			"translation": "Điểm Đánh giá TB:"
		}, {
			"value": "Top Sales Rank:",
			"translation": "Hạng Doanh thu Cao nhất:"
		}, {
			"value": "Do you really want to throw away this game?",
			"translation": "Bạn có thực sự muốn bỏ trò chơi này không?"
		}, {
			"value": "Note:",
			"translation": "Lưu ý:"
		}, {
			"value": "You do not lose the experience gained during development.",
			"translation": "Bạn không mất kinh nghiệm đã đạt được trong quá trình phát triển."
		}, {
			"value": "Do you really want to remove this from the market?",
			"translation": "Bạn có thực sự muốn gỡ bỏ sản phẩm này khỏi thị trường không?"
		}, {
			"value": "You will no longer get any income from it.",
			"translation": "Bạn sẽ không còn nhận được bất kỳ thu nhập nào từ nó."
		}, {
			"value": "Do you really want to cancel this project?",
			"translation": "Bạn có thực sự muốn hủy dự án này không?"
		}, {
			"value": "All progress on the project will be",
			"translation": "Tất cả tiến độ của dự án sẽ bị"
		}, {
			"value": "lost!",
			"translation": "mất!"
		}, {
			"value": "Do you really want to overwrite this game?",
			"translation": "Bạn có thực sự muốn ghi đè lên trò chơi này không?"
		}, {
			"value": "Some of the features in the full game",
			"translation": "Một số tính năng trong phiên bản đầy đủ"
		}, {
			"value": "Move your company into bigger offices.",
			"translation": "Chuyển công ty của bạn đến văn phòng lớn hơn."
		}, {
			"value": "Hire and train staff.",
			"translation": "Thuê và đào tạo nhân viên."
		}, {
			"value": "Develop bigger/better games and unlock even more options.",
			"translation": "Phát triển các trò chơi lớn hơn/tốt hơn và mở khóa nhiều tùy chọn hơn nữa."
		}, {
			"value": "Unlock secret labs and conduct industry-changing projects.",
			"translation": "Mở khóa các phòng thí nghiệm bí mật và thực hiện các dự án thay đổi ngành công nghiệp."
		}, {
			"value": "And much more!",
			"translation": "Và nhiều hơn nữa!"
		}, {
			"value": "Unlock Full Game ...",
			"translation": "Mở khóa Toàn bộ Game ..."
		}, {
			"value": "Final Score",
			"translation": "Điểm Cuối cùng"
		}, {
			"value": "Close",
			"translation": "Đóng"
		}, {
			"value": "Send us feedback",
			"translation": "Gửi phản hồi cho chúng tôi"
		}, {
			"value": "Want to provide some feedback or report some issues? Send us an email to support@greenheartgames.com - While we might not respond to every email we do read/consider everything that is sent to us.",
			"translation": "Bạn muốn cung cấp phản hồi hoặc báo cáo sự cố? Hãy gửi email cho chúng tôi tới support@greenheartgames.com - Mặc dù chúng tôi có thể không trả lời mọi email, chúng tôi sẽ đọc/xem xét mọi thứ được gửi đến."
		}, {
			"value": "Send feedback ...",
			"translation": "Gửi phản hồi ..."
		}, {
			"value": "Rate and Review",
			"translation": "Đánh giá và Nhận xét"
		}, {
			"value": "If you like the game please consider rating it on the Store. If you want to support an issue please do not do this via a Store rating as we will be unable to reply.",
			"translation": "Nếu bạn thích trò chơi, vui lòng xem xét đánh giá nó trên Cửa hàng. Nếu bạn muốn hỗ trợ một vấn đề, vui lòng không thực hiện việc này thông qua đánh giá trên Cửa hàng vì chúng tôi sẽ không thể trả lời."
		}, {
			"value": "Rate and Review ...",
			"translation": "Đánh giá và Nhận xét ..."
		}, {
			"value": "Vote with your wallet",
			"translation": "Ủng hộ bằng tiền của bạn"
		}, {
			"value": "If you would've gladly paid a little more for the game or you just want to help make sure that we can continue bringing you games in the future then you can buy one of the supporter packs below. You will support a small independent start-up. This does not unlock any in-game perks and is entirely optional. You do get an achievement though :)",
			"translation": "Nếu bạn sẵn lòng trả thêm một chút cho trò chơi hoặc bạn chỉ muốn giúp đảm bảo rằng chúng tôi có thể tiếp tục mang đến cho bạn nhiều trò chơi hơn trong tương lai, thì bạn có thể mua một trong các gói hỗ trợ bên dưới. Bạn sẽ hỗ trợ một công ty khởi nghiệp nhỏ độc lập. Điều này không mở khóa bất kỳ đặc quyền nào trong trò chơi và hoàn toàn là tùy chọn. Tuy nhiên, bạn sẽ nhận được một thành tựu :)"
		}, {
			"value": "Thank you for playing!",
			"translation": "Cảm ơn bạn đã chơi!"
		}, {
			"value": "Current Game Statistics",
			"translation": "Thống kê Game Hiện tại"
		}, {
			"value": "Pre-filter Applicants",
			"translation": "Lọc trước Ứng viên"
		}, {
			"value": "Start looking",
			"translation": "Bắt đầu tìm kiếm"
		}, {
			"value": "First Last",
			"translation": "Họ Tên"
		}, {
			"value": "Experience",
			"translation": "Kinh nghiệm"
		}, {
			"value": "Speed",
			"translation": "Tốc độ"
		}, {
			"value": "Salary",
			"translation": "Lương"
		}, {
			"value": "Hire Staff",
			"translation": "Thuê Nhân viên"
		}, {
			"value": "Hire",
			"translation": "Thuê"
		}, {
			"value": "Accept Contract",
			"translation": "Chấp nhận Hợp đồng"
		}, {
			"value": "Achievement Unlocked",
			"translation": "Đã mở khóa Thành tựu"
		}, {
			"value": "Sound Effects",
			"translation": "Hiệu ứng Âm thanh"
		}, {
			"value": "Game Music",
			"translation": "Nhạc Game"
		}, {
			"value": "Volume",
			"translation": "Âm lượng"
		}, {
			"value": "Hint:",
			"translation": "Gợi ý:"
		}, {
			"value": "We cannot respond to ratings & reviews on the Store.",
			"translation": "Chúng tôi không thể trả lời các đánh giá & nhận xét trên Cửa hàng."
		}, {
			"value": "If you want to get in contact with us please do not do this via a Store rating/review but use one of the options below.",
			"translation": "Nếu bạn muốn liên hệ với chúng tôi, vui lòng không thực hiện việc này thông qua đánh giá/nhận xét trên Cửa hàng mà hãy sử dụng một trong các tùy chọn bên dưới."
		}, {
			"value": "Support",
			"translation": "Hỗ trợ"
		}, {
			"value": "Best for technical issues, detailed feedback or private messages.",
			"translation": "Tốt nhất cho các vấn đề kỹ thuật, phản hồi chi tiết hoặc tin nhắn riêng tư."
		}, {
			"value": "Social Media",
			"translation": "Mạng Xã hội"
		}, {
			"value": "Development stages",
			"translation": "Các giai đoạn phát triển"
		}, {
			"value": "Stage 1",
			"translation": "Giai đoạn 1"
		}, {
			"value": "The game engine provides the basic building block of a game, the underlying technology. A good engine also enables things like multiplayer support, video playback and realistic physics.",
			"translation": "Engine game cung cấp khối xây dựng cơ bản của một trò chơi, công nghệ nền tảng. Một engine tốt cũng cho phép những thứ như hỗ trợ nhiều người chơi, phát lại video và vật lý thực tế."
		}, {
			"value": "Gameplay defines how a player interacts with the game and how the game mechanics, the rules that make a game tick, work.",
			"translation": "Lối chơi xác định cách người chơi tương tác với trò chơi và cách cơ chế trò chơi, các quy tắc khiến trò chơi hoạt động, vận hành."
		}, {
			"value": "Storytelling and giving players goals to complete have been the basics of games for a long time.",
			"translation": "Kể chuyện và giao mục tiêu cho người chơi hoàn thành đã là những yếu tố cơ bản của trò chơi trong một thời gian dài."
		}, {
			"value": "Stage 2",
			"translation": "Giai đoạn 2"
		}, {
			"value": "Dialogues are part of storytelling as well but also provide interaction between NPC's (non-player characters) and the player.",
			"translation": "Đối thoại cũng là một phần của việc kể chuyện nhưng cũng cung cấp sự tương tác giữa NPC (nhân vật không phải người chơi) và người chơi."
		}, {
			"value": "Level design defines the structure a player takes through a game. This includes simple things like where objects are located but also the story arcs in a game.",
			"translation": "Thiết kế màn chơi xác định cấu trúc mà người chơi trải qua trong một trò chơi. Điều này bao gồm những thứ đơn giản như vị trí của các đối tượng mà còn cả các tình tiết câu chuyện trong trò chơi."
		}, {
			"value": "A.I. is how computer controlled entities (enemies, companions or the world itself) reacts to the player.",
			"translation": "A.I. là cách các thực thể do máy tính điều khiển (kẻ thù, bạn đồng hành hoặc chính thế giới) phản ứng với người chơi."
		}, {
			"value": "Stage 3",
			"translation": "Giai đoạn 3"
		}, {
			"value": "Some games invent an entire virtual world. World design delivers a back story to a game and makes the game world more sophisticated and believable.",
			"translation": "Một số trò chơi tạo ra cả một thế giới ảo. Thiết kế thế giới mang đến một câu chuyện nền cho trò chơi và làm cho thế giới trò chơi trở nên phức tạp và đáng tin cậy hơn."
		}, {
			"value": "Graphics",
			"translation": "Đồ họa"
		}, {
			"value": "The most obvious part of a game are its graphics but that doesn't mean it is always the most important part.",
			"translation": "Phần dễ thấy nhất của một trò chơi là đồ họa của nó nhưng điều đó không có nghĩa là nó luôn là phần quan trọng nhất."
		}, {
			"value": "Good Judgement",
			"comment": "achievement title",
			"translation": "Đánh giá Tốt"
		}, {
			"value": "Cult Status",
			"comment": "achievement title",
			"translation": "Địa vị Sùng bái"
		}, {
			"value": "Set a new standard for the early gaming industry.",
			"comment": "achievement",
			"translation": "Thiết lập một tiêu chuẩn mới cho ngành công nghiệp game thời kỳ đầu."
		}, {
			"value": "100K Engine",
			"comment": "achievement title",
			"translation": "Engine 100K"
		}, {
			"value": "Invest over 100K in a new game engine.",
			"comment": "achievement",
			"translation": "Đầu tư hơn 100K vào một engine game mới."
		}, {
			"value": "500K Engine",
			"comment": "achievement title",
			"translation": "Engine 500K"
		}, {
			"value": "Invest over 500K in a new game engine.",
			"comment": "achievement",
			"translation": "Đầu tư hơn 500K vào một engine game mới."
		}, {
			"value": "1M Engine",
			"comment": "achievement title",
			"translation": "Engine 1 Triệu"
		}, {
			"value": "Invest over one million in a new game engine.",
			"comment": "achievement",
			"translation": "Đầu tư hơn một triệu vào một engine game mới."
		}, {
			"value": "Gold",
			"comment": "achievement title",
			"translation": "Vàng"
		}, {
			"value": "Sell half a million copies of a game without the help of a publisher.",
			"comment": "achievement",
			"translation": "Bán nửa triệu bản game mà không cần sự giúp đỡ của nhà phát hành."
		}, {
			"value": "Platinum",
			"comment": "achievement title",
			"translation": "Bạch kim"
		}, {
			"value": "Sell one million copies of a game without the help of a publisher.",
			"comment": "achievement",
			"translation": "Bán một triệu bản game mà không cần sự giúp đỡ của nhà phát hành."
		}, {
			"value": "Diamond",
			"comment": "achievement title",
			"translation": "Kim cương"
		}, {
			"value": "Sell ten million copies of a game without the help of a publisher.",
			"comment": "achievement",
			"translation": "Bán mười triệu bản game mà không cần sự giúp đỡ của nhà phát hành."
		}, {
			"value": "Unobtainium (seriously?)",
			"comment": "achievement title, refers to unobtanium, mocks the name of the rare mineral in the movie Avatar",
			"translation": "Unobtainium (nghiêm túc đấy?)"
		}, {
			"value": "Sell one hundred million copies of a game without the help of a publisher.",
			"comment": "achievement",
			"translation": "Bán một trăm triệu bản game mà không cần sự giúp đỡ của nhà phát hành."
		}, {
			"value": "Professional",
			"comment": "achievement title",
			"translation": "Chuyên nghiệp"
		}, {
			"value": "Reach level 5 with a character.",
			"comment": "achievement",
			"translation": "Đạt cấp 5 với một nhân vật."
		}, {
			"value": "Legend",
			"comment": "achievement title",
			"translation": "Huyền thoại"
		}, {
			"value": "Reach level 10 with a character.",
			"comment": "achievement",
			"translation": "Đạt cấp 10 với một nhân vật."
		}, {
			"value": "Diversity",
			"comment": "achievement title",
			"translation": "Đa dạng"
		}, {
			"value": "Have male and female staff.",
			"comment": "achievement",
			"translation": "Có nhân viên nam và nữ."
		}, {
			"value": "Famous",
			"comment": "achievement title",
			"translation": "Nổi tiếng"
		}, {
			"value": "Hire someone famous.",
			"comment": "achievement",
			"translation": "Thuê một người nổi tiếng."
		}, {
			"value": "Full House",
			"comment": "achievement title",
			"translation": "Đủ Người"
		}, {
			"value": "Have the maximum number of employees.",
			"comment": "achievement",
			"translation": "Có số lượng nhân viên tối đa."
		}, {
			"value": "Game Dev Tycoon",
			"translation": "Game Dev Tycoon"
		}, {
			"value": "Finish Game Dev Tycoon.",
			"comment": "achievement",
			"translation": "Hoàn thành Game Dev Tycoon."
		}, {
			"value": "Perfect Game",
			"comment": "achievement title",
			"translation": "Game Hoàn hảo"
		}, {
			"value": "Release a game with a clean score of 10.",
			"comment": "achievement",
			"translation": "Phát hành một trò chơi với điểm số hoàn hảo là 10."
		}, {
			"value": "Detective",
			"comment": "achievement title",
			"translation": "Thám tử"
		}, {
			"value": "Find at least one of the easter eggs in the game.",
			"comment": "achievement",
			"translation": "Tìm ít nhất một trong những easter egg trong trò chơi."
		}, {
			"value": "Treasure Hunter",
			"comment": "achievement title",
			"translation": "Thợ săn Kho báu"
		}, {
			"value": "Activate the hidden treasure in the garage.",
			"comment": "achievement",
			"translation": "Kích hoạt kho báu ẩn trong gara."
		}, {
			"value": "Bluehair reporting for space duty",
			"comment": "achievement refers to Wing Commander, leave 'Bluehair'",
			"translation": "Bluehair báo cáo nhận nhiệm vụ không gian"
		}, {
			"value": "Little known fact: Cats go all aggro in space.",
			"comment": "achievement refers to Wing Commander",
			"translation": "Một sự thật ít người biết: Mèo trở nên rất hung hăng trong không gian."
		}, {
			"value": "Welcome to Mars",
			"comment": "achievement title, refers to Doom",
			"translation": "Chào mừng đến Sao Hỏa"
		}, {
			"value": "How did I get here? Why is there a chainsaw? Who cares!",
			"comment": "achievement refers to Doom",
			"translation": "Làm sao tôi đến được đây? Tại sao lại có cưa máy? Ai quan tâm chứ!"
		}, {
			"value": "Best ride to work ever",
			"comment": "achievement title, referes to half life",
			"translation": "Chuyến đi làm tuyệt nhất từ trước đến nay"
		}, {
			"value": "Workplace safety anyone?",
			"comment": "achievement referes to half life",
			"translation": "An toàn lao động đâu rồi?"
		}, {
			"value": "Welcome to your hospital",
			"comment": "achievement title, refers to Theme Hospital",
			"translation": "Chào mừng đến bệnh viện của bạn"
		}, {
			"value": "Patients are reminded not to die in the corridors.",
			"comment": "achievement refers to Theme Hospital, use official translation for this.",
			"translation": "Bệnh nhân được nhắc nhở không được chết ở hành lang."
		}, {
			"value": "Welcome Chief",
			"comment": "achievement title, refers to Halo",
			"translation": "Chào mừng Sếp"
		}, {
			"value": "This world is round but different.",
			"comment": "achievement refers to Halo",
			"translation": "Thế giới này tròn nhưng khác biệt."
		}, {
			"value": "The sky is not the limit.",
			"comment": "achievement title, refers to Star Citizen",
			"translation": "Bầu trời không phải là giới hạn."
		}, {
			"value": "Welcome back Chris. We've missed you.",
			"comment": "achievement refers to Chris Roberts",
			"translation": "Chào mừng trở lại Chris. Chúng tôi đã nhớ bạn."
		}, {
			"value": "Painting with nature.",
			"comment": "achievement title, refers to Okami",
			"translation": "Vẽ bằng thiên nhiên."
		}, {
			"value": "Pay homage to a specific Japanese video game.",
			"comment": "achievement refers to Okami",
			"translation": "Tỏ lòng kính trọng với một trò chơi điện tử Nhật Bản cụ thể."
		}, {
			"value": "Inception",
			"comment": "achievement title",
			"translation": "Khởi nguồn"
		}, {
			"value": "Develop the game within the game.",
			"comment": "achievement, inception",
			"translation": "Phát triển trò chơi trong trò chơi."
		}, {
			"value": "Fan",
			"translation": "Người hâm mộ"
		}, {
			"value": "Pick an inspired company name.",
			"comment": "achievement",
			"translation": "Chọn một tên công ty đầy cảm hứng."
		}, {
			"value": "Versatile",
			"comment": "achievement title",
			"translation": "Đa năng"
		}, {
			"value": "Release a successful game in each of the five main genres.",
			"comment": "achievement",
			"translation": "Phát hành một trò chơi thành công ở mỗi thể loại trong năm thể loại chính."
		}, {
			"value": "Eat Cake",
			"comment": "achievement title",
			"translation": "Ăn Bánh"
		}, {
			"value": "Show them red barrels some action.",
			"comment": "achievement",
			"translation": "Cho những thùng đỏ đó thấy một chút hành động."
		}, {
			"value": "Supporter",
			"comment": "achievement title",
			"translation": "Người ủng hộ"
		}, {
			"value": "Support a young start-up. Buy the game.",
			"comment": "achievement",
			"translation": "Hỗ trợ một công ty khởi nghiệp trẻ. Mua trò chơi."
		}, {
			"value": "Support Greenheart Games by buying an optional supporter pack.",
			"comment": "achievement",
			"translation": "Hỗ trợ Greenheart Games bằng cách mua một gói hỗ trợ tùy chọn."
		}, {
			"value": "Admirer",
			"comment": "achievement title",
			"translation": "Người ngưỡng mộ"
		}, {
			"value": "Fun fact: We almost named our company Megaflop Productions!",
			"comment": "achievement, leave 'Megaflop Productions'",
			"translation": "Sự thật thú vị: Chúng tôi suýt nữa đã đặt tên công ty là Megaflop Productions!"
		}, {
			"value": "Writer's Block",
			"comment": "achievement title",
			"translation": "Bí Ý tưởng"
		}, {
			"value": "Naming games is sometimes difficult.",
			"comment": "achievement",
			"translation": "Đặt tên game đôi khi thật khó."
		}, {
			"value": "While sound is not as often noticed as the graphics of a game, sound design plays a vital part to making a game great.",
			"translation": "Mặc dù âm thanh không thường được chú ý như đồ họa của một trò chơi, thiết kế âm thanh đóng một vai trò quan trọng để tạo nên một trò chơi tuyệt vời."
		}, {
			"value": "Hints",
			"translation": "Gợi ý"
		}, {
			"value": "Think about what game you want to create, then decide what areas are really important for this game and focus on those. Don't hesitate to experiment and to change the values of the sliders around a lot.",
			"translation": "Hãy suy nghĩ về trò chơi bạn muốn tạo, sau đó quyết định những lĩnh vực nào thực sự quan trọng đối với trò chơi này và tập trung vào chúng. Đừng ngần ngại thử nghiệm và thay đổi nhiều giá trị của các thanh trượt."
		}, {
			"value": "Tutorial message history",
			"translation": "Lịch sử tin nhắn hướng dẫn"
		}, {
			"value": "Create a game with a good topic/genre combination.",
			"comment": "achievement",
			"translation": "Tạo một trò chơi với sự kết hợp chủ đề/thể loại tốt."
		}, {
			"value": "Turn it up to 11",
			"comment": "achievement title",
			"translation": "Chơi tới bến"
		}, {
			"value": "Get a reviewer to give you a 11/10 rating.",
			"comment": "achievement",
			"translation": "Khiến một nhà phê bình cho bạn điểm 11/10."
		}, {
			"value": "Save failed",
			"translation": "Lưu thất bại"
		}, {
			"value": "Could not load settings from steam cloud",
			"translation": "Không thể tải cài đặt từ Steam Cloud"
		}, {
			"value": "Could not save to steam cloud",
			"translation": "Không thể lưu vào Steam Cloud"
		}, {
			"value": "Could not save settings",
			"translation": "Không thể lưu cài đặt"
		}, {
			"value": "Could not save game",
			"translation": "Không thể lưu game"
		}, {
			"value": "Hi, I'm Denise Ried the main developer of the {0} fan game. I just want to tell you that upon your recent 'request' from your legal department my project has shut down.{n}I poured a lot of effort into this and have always loved your company but I guarantee you that I shall not 'bother' nor support you ever again.",
			"comment": "{0} game name",
			"translation": "Chào bạn, tôi là Denise Ried, nhà phát triển chính của trò chơi fanmade {0}. Tôi chỉ muốn nói với bạn rằng theo 'yêu cầu' gần đây từ bộ phận pháp lý của bạn, dự án của tôi đã phải dừng lại.{n}Tôi đã đổ rất nhiều công sức vào dự án này và luôn yêu quý công ty của bạn, nhưng tôi đảm bảo rằng tôi sẽ không bao giờ 'làm phiền' hay ủng hộ bạn nữa."
		}, {
			"value": "If you wish you can continue playing but please note that there will be no more platform releases or other story elements.",
			"translation": "Nếu muốn, bạn có thể tiếp tục chơi nhưng xin lưu ý rằng sẽ không có thêm bản phát hành nền tảng nào hoặc các yếu tố cốt truyện khác."
		}, {
			"value": "Agree",
			"comment": "decision action button",
			"translation": "Đồng ý"
		}, {
			"value": "Given that their most recent game {0} enjoyed universal success we simply cannot wait for them to unveil their new project!",
			"translation": "Với việc trò chơi gần đây nhất của họ {0} đã đạt được thành công vang dội, chúng tôi đơn giản là không thể chờ đợi họ công bố dự án mới của mình!"
		}, {
			"value": "Hopefully the company can do better than last time. We don't need another {0}.",
			"translation": "Hy vọng công ty có thể làm tốt hơn lần trước. Chúng ta không cần thêm một {0} nữa."
		}, {
			"value": "Thank you for your time.",
			"translation": "Cảm ơn bạn đã dành thời gian."
		}, {
			"value": "More on {0}",
			"translation": "Thêm về {0}"
		}, {
			"value": "they are still experimenting what area",
			"comment": "sentence fragment",
			"translation": "họ vẫn đang thử nghiệm lĩnh vực nào"
		}, {
			"value": "and it seems that other industry professionals agree with this. Every game development project has limited resources so it's very important to use the time most effectively.",
			"comment": "sentence fragment",
			"translation": "và có vẻ như các chuyên gia khác trong ngành cũng đồng ý với điều này. Mọi dự án phát triển game đều có nguồn lực hạn chế nên việc sử dụng thời gian hiệu quả nhất là rất quan trọng."
		}, {
			"value": "but it seems that other industry professionals disagree with that point of view saying that {0} is usually more important for this type of game.",
			"comment": "sentence fragment",
			"translation": "nhưng có vẻ như các chuyên gia khác trong ngành không đồng ý với quan điểm đó, họ cho rằng {0} thường quan trọng hơn đối với loại trò chơi này."
		}, {
			"value": "give away",
			"translation": "tặng đi"
		}, {
			"value": "sell",
			"translation": "bán"
		}, {
			"value": "negative",
			"translation": "tiêu cực"
		}, {
			"value": "Boss, it seems the fans who requested that we open source {0} were particularly upset with our decision and have caused quite a negative stirr. We've lost {1} fans.",
			"translation": "Sếp ơi, có vẻ như những người hâm mộ yêu cầu chúng ta mở mã nguồn {0} đặc biệt không hài lòng với quyết định của chúng ta và đã gây ra một sự xáo trộn tiêu cực. Chúng ta đã mất {1} người hâm mộ."
		}, {
			"value": "gained",
			"translation": "đã giành được"
		}, {
			"value": "it cost us {0}",
			"translation": "chúng ta tốn {0}"
		}, {
			"value": "we made {0}",
			"comment": "{0} is amount of money",
			"translation": "chúng ta kiếm được {0}"
		}, {
			"value": "Legal Department",
			"translation": "Phòng Pháp lý"
		}, {
			"value": "Go to court. [~{0}% chance]",
			"translation": "Ra tòa. [~{0}% cơ hội]"
		}, {
			"value": "The court dismissed the patent infringement claims made against us stating that the claim was ridiculous. All costs were paid by the suing party.",
			"translation": "Tòa án đã bác bỏ các khiếu nại vi phạm bằng sáng chế chống lại chúng tôi, cho rằng khiếu nại đó là vô lý. Mọi chi phí đều do bên khởi kiện chi trả."
		}, {
			"value": "We rallied our fans to publicly fight against All Your IP Belongs To US",
			"comment": "continues with fragment",
			"translation": "Chúng tôi đã tập hợp người hâm mộ để công khai chống lại All Your IP Belongs To US"
		}, {
			"value": " and fight we did! We not only caused them to retract their claims but we also won {0} fans and the public's admiration. I doubt we will hear from those patent trolls again.",
			"comment": "sentence fragment",
			"translation": " và chúng tôi đã chiến đấu! Chúng tôi không chỉ khiến họ rút lại yêu sách mà còn giành được {0} người hâm mộ và sự ngưỡng mộ của công chúng. Tôi nghi ngờ chúng ta sẽ còn nghe tin từ những kẻ troll bằng sáng chế đó nữa."
		}, {
			"value": " but it seems that our efforts were fruitless. Seems we still have to pay {0} and the court costs of {1}. Maybe next time we'll have more luck.",
			"comment": "sentence fragment",
			"translation": " nhưng có vẻ như những nỗ lực của chúng tôi là vô ích. Có vẻ như chúng tôi vẫn phải trả {0} và án phí {1}. Có lẽ lần sau chúng ta sẽ may mắn hơn."
		}, {
			"value": "Settings",
			"translation": "Cài đặt"
		}, {
			"value": "Verifying...",
			"translation": "Đang xác minh..."
		}, {
			"value": "Could not initialize loaded game",
			"translation": "Không thể khởi tạo trò chơi đã tải"
		}, {
			"value": "We made it into the top 100 conference attractions this year at place {0}.",
			"translation": "Chúng ta đã lọt vào top 100 điểm thu hút của hội nghị năm nay ở vị trí {0}."
		}, {
			"value": "okay",
			"translation": "tạm ổn"
		}, {
			"value": "terrible",
			"translation": "kinh khủng"
		}, {
			"value": "unknown",
			"translation": "không rõ"
		}, {
			"value": "not at all important",
			"translation": "hoàn toàn không quan trọng"
		}, {
			"value": "not very important",
			"translation": "không quan trọng lắm"
		}, {
			"value": "very important",
			"translation": "rất quan trọng"
		}, {
			"value": "Error",
			"translation": "Lỗi"
		}, {
			"value": "Mirconoft has announced the delay of their new gaming console, mBox. The new release date is '{0}'. Rumour has it that the incredible success of the Playsystem 2 launch has prompted Mirconoft to delay their own debut.",
			"comment": "{0} is date referral sentence fragment",
			"translation": "Mirconoft đã thông báo trì hoãn hệ máy chơi game mới của họ, mBox. Ngày phát hành mới là '{0}'. Có tin đồn rằng thành công đáng kinh ngạc của việc ra mắt Playsystem 2 đã khiến Mirconoft trì hoãn việc ra mắt sản phẩm của riêng mình."
		}, {
			"value": "Today, Ninvento has announced a new mobile console called the Ninvento GS. It features two screens, one of them touch sensitive, and promises unique gameplay. While Ninvento has been struggling to regain their market lead ever since the TES 64 they still have a very strong position on the mobile market.{n}The Ninvento GS promises to strengthen this position and aims to breath life into a stagnating mobile market. The console will be in stores {0}.",
			"comment": "{0} is date referral sentence fragment",
			"translation": "Hôm nay, Ninvento đã công bố một hệ máy di động mới có tên là Ninvento GS. Nó có hai màn hình, một trong số đó có cảm ứng, và hứa hẹn lối chơi độc đáo. Mặc dù Ninvento đã phải vật lộn để giành lại vị trí dẫn đầu thị trường kể từ TES 64, họ vẫn có một vị thế rất mạnh trên thị trường di động.{n}Ninvento GS hứa hẹn sẽ củng cố vị thế này và nhằm mục đích thổi luồng sinh khí mới vào thị trường di động đang trì trệ. Hệ máy này sẽ có mặt tại các cửa hàng {0}."
		}, {
			"value": "Today, Mirconoft has announced their very own tablet device to combat the massive marketshare of Grapple's grPad device. The mPad features a sophisticated cover that comes with a integrated, ultra-thin keyboard. The tablet itself has a widescreen display and a integrated stand.{n}The mPad seems to be a combination of a traditional notebook and a tablet, and promises to shake up the market. The new product will be on the market {0}.",
			"comment": "{0} is date referral sentence fragment",
			"translation": "Hôm nay, Mirconoft đã công bố thiết bị máy tính bảng của riêng họ để cạnh tranh với thị phần khổng lồ của thiết bị grPad của Grapple. mPad có một vỏ bọc tinh xảo đi kèm với bàn phím siêu mỏng tích hợp. Bản thân máy tính bảng có màn hình rộng và chân đế tích hợp.{n}mPad dường như là sự kết hợp giữa máy tính xách tay truyền thống và máy tính bảng, và hứa hẹn sẽ làm rung chuyển thị trường. Sản phẩm mới sẽ có mặt trên thị trường {0}."
		}, {
			"value": "For fans of the mBox, the long wait for an update to the console will soon be over as Mirconoft has announced that the mBox One will be available {0}.",
			"comment": "{0} is date referral sentence fragment",
			"translation": "Đối với những người hâm mộ mBox, sự chờ đợi một bản cập nhật cho hệ máy này sẽ sớm kết thúc khi Mirconoft đã thông báo rằng mBox One sẽ có mặt {0}."
		}, {
			"value": "The new console is marketed as a unified entertainment platform and comes with voice control and a camera which is always watching to enable gesture control. A camera which is always on is not the only controversial feature as the new console also seems to require internet access at least once a day to function properly, does not support previous mBox games and seems to place restrictions on how games can be shared or resold.{n}Clearly, Mirconoft wants to push the current status quo and deliver a console for a new future of gaming but we are not sure if players will share Micronoft's vision.",
			"translation": "Hệ máy mới được tiếp thị như một nền tảng giải trí hợp nhất và đi kèm với điều khiển bằng giọng nói và một camera luôn theo dõi để cho phép điều khiển bằng cử chỉ. Một camera luôn bật không phải là tính năng gây tranh cãi duy nhất vì hệ máy mới này dường như cũng yêu cầu truy cập internet ít nhất một lần một ngày để hoạt động bình thường, không hỗ trợ các trò chơi mBox trước đó và dường như đặt ra những hạn chế về cách chia sẻ hoặc bán lại trò chơi.{n}Rõ ràng, Mirconoft muốn thúc đẩy hiện trạng và mang đến một hệ máy cho một tương lai mới của ngành game nhưng chúng tôi không chắc liệu người chơi có chia sẻ tầm nhìn của Mirconoft hay không."
		}, {
			"value": "Just after Mirconoft have announced their new bet in the upcoming console generation, Vonny has announced that they will release their new, long-awaited console, the Playsystem 4, {0}. The console seems to do everything that the Playsystem 3 did, only better.{n}Unlike the mBox One, the Playsystem 4 doesn't have an always-online requirement and seems much more player friendly. We think that there is hardly a risk of Vonny fans being disappointed",
			"comment": "{0} is date referral sentence fragment, sentence itself is a fragment and continues with 'but ...'",
			"translation": "Ngay sau khi Mirconoft công bố sản phẩm mới của họ trong thế hệ console sắp tới, Vonny đã thông báo rằng họ sẽ phát hành hệ máy mới được chờ đợi từ lâu, Playsystem 4, {0}. Hệ máy này dường như làm được mọi thứ mà Playsystem 3 đã làm, chỉ có điều tốt hơn.{n}Không giống như mBox One, Playsystem 4 không yêu cầu kết nối trực tuyến liên tục và có vẻ thân thiện với người chơi hơn nhiều. Chúng tôi nghĩ rằng khó có nguy cơ người hâm mộ Vonny sẽ thất vọng"
		}, {
			"value": "Vonny and {0}",
			"translation": "Vonny và {0}"
		}, {
			"value": "A company by the name of RiseVR has developed a virtual reality headset which promises to finally start the path towards true 3D immersion. The new headset called Visorius looks like a pair of giant ski-goggles and provides a large field of vision as well as near-perfect motion tracking.",
			"translation": "Một công ty có tên RiseVR đã phát triển một bộ kính thực tế ảo hứa hẹn cuối cùng sẽ mở ra con đường hướng tới sự đắm chìm 3D thực sự. Bộ kính mới có tên Visorius trông giống như một cặp kính trượt tuyết khổng lồ và cung cấp một trường nhìn rộng cũng như theo dõi chuyển động gần như hoàn hảo."
		}, {
			"value": "Mirconoft has announced their plans to release a completely revamped version of the mBox {0} called mBox Next. The new console seems to cleverly integrate Mirconoft's own motion sensor add-on for the mBox One into one small package.{n}Visually, the mBox Next is reminiscent of the earlier mBox 360 with a much lighter tone marking a departure from the bulky and dark style of the mBox One. The technology of the mBox Next seems promising  ",
			"comment": "{0} is date referral sentence fragment, sentence itself is a fragment and continues with 'but ...'",
			"translation": "Mirconoft đã công bố kế hoạch phát hành một phiên bản hoàn toàn mới của mBox {0} có tên là mBox Next. Hệ máy mới dường như tích hợp một cách thông minh cảm biến chuyển động bổ trợ của Mirconoft cho mBox One vào một gói nhỏ gọn.{n}Về mặt hình ảnh, mBox Next gợi nhớ đến mBox 360 trước đó với tông màu sáng hơn nhiều, đánh dấu sự khác biệt so với phong cách cồng kềnh và tối tăm của mBox One. Công nghệ của mBox Next có vẻ hứa hẹn  "
		}, {
			"value": "Many have expected that Vonny will announce a new platform before Mirconoft's mBox Next will hit the market and, today, Vonny did just that. Keeping with company tradition, and in contrast to competitor Mirconoft's naming practices, the newly announced console is aptly named Playsystem 5.{n}The Playsystem 5 seems an incremental update, coming out {0} with a form-factor that reminds of the early Playsystem 3. The new system promises to be a solid update",
			"comment": "{0} is date referral sentence fragment, sentence itself is a fragment and continues with 'but ...'",
			"translation": "Nhiều người đã kỳ vọng rằng Vonny sẽ công bố một nền tảng mới trước khi mBox Next của Mirconoft có mặt trên thị trường và hôm nay, Vonny đã làm đúng như vậy. Giữ vững truyền thống của công ty, và trái ngược với cách đặt tên của đối thủ Mirconoft, hệ máy mới được công bố có tên rất phù hợp là Playsystem 5.{n}Playsystem 5 dường như là một bản cập nhật gia tăng, ra mắt {0} với kiểu dáng gợi nhớ đến Playsystem 3 đời đầu. Hệ thống mới hứa hẹn sẽ là một bản cập nhật vững chắc"
		}, {
			"value": "This is the {0} version of Game Dev Tycoon in which you can play until year five.",
			"comment": "{0} is either lite or trial",
			"translation": "Đây là phiên bản {0} của Game Dev Tycoon, trong đó bạn có thể chơi đến năm thứ năm."
		}, {
			"value": "Looking at our past multi-platform games it becomes clear that we should be able to drastically reduce the cost of developing a single game for multiple platforms if we could better optimize our game engines for multi-platform development.",
			"translation": "Nhìn lại các trò chơi đa nền tảng trước đây của chúng ta, rõ ràng là chúng ta có thể giảm đáng kể chi phí phát triển một trò chơi cho nhiều nền tảng nếu chúng ta có thể tối ưu hóa tốt hơn các engine game của mình cho việc phát triển đa nền tảng."
		}, {
			"value": "New Insight",
			"comment": "heading",
			"translation": "Hiểu biết Mới"
		}, {
			"value": "Help debugging a convoluted BASE program.",
			"translation": "Giúp gỡ lỗi một chương trình BASE phức tạp."
		}, {
			"value": "Advanced Stereoscopic 3D",
			"translation": "3D Lập thể Nâng cao"
		}, {
			"value": "Simple A.I.",
			"translation": "A.I. Đơn giản"
		}, {
			"value": "Game tutorials",
			"translation": "Hướng dẫn trong game"
		}, {
			"value": "Cooperative play",
			"translation": "Chơi phối hợp"
		}, {
			"value": "Advanced physics",
			"translation": "Vật lý nâng cao"
		}, {
			"value": "Multi-Platform optimized",
			"translation": "Tối ưu hóa Đa nền tảng"
		}, {
			"value": "Dynamic environment",
			"translation": "Môi trường động"
		}, {
			"value": "Multi-Platform",
			"translation": "Đa nền tảng"
		}, {
			"value": "{0} and {1} is a terrible combination.",
			"translation": "{0} và {1} là một sự kết hợp tồi tệ."
		}, {
			"value": "{0} is a horrible topic for {1} audiences.",
			"translation": "{0} là một chủ đề kinh khủng cho đối tượng {1}."
		}, {
			"value": "blunt",
			"translation": "nhạt nhẽo"
		}, {
			"value": "They put as much thought into the game as into the game's name.",
			"translation": "Họ đầu tư vào trò chơi cũng nhiều như vào tên của nó vậy."
		}, {
			"value": "Good, despite the name.",
			"translation": "Tốt, mặc dù cái tên hơi kỳ."
		}, {
			"value": "Could have been better.",
			"translation": "Có thể đã tốt hơn."
		}, {
			"value": "11 out of 10. Game of the year, any year!",
			"translation": "11/10. Game của năm, bất kể năm nào!"
		}, {
			"value": "11 out of 10. A exceptional score for an exceptional game.",
			"translation": "11/10. Một điểm số đặc biệt cho một trò chơi đặc biệt."
		}, {
			"value": "In an exclusive interview a while ago, {0} from {1}",
			"comment": "followed by sentence fragment (hypgfr1 or hypgfr2)",
			"translation": "Trong một cuộc phỏng vấn độc quyền cách đây một thời gian, {0} từ {1}"
		}, {
			"value": " made very bold remarks about their then-in-development game {0} predicting that it will be über successful.",
			"comment": "fragment: hypgfr1",
			"translation": " đã đưa ra những nhận xét rất táo bạo về trò chơi {0} đang được phát triển của họ, dự đoán rằng nó sẽ thành công rực rỡ."
		}, {
			"value": " was holding back when discussing their expections for {0}.",
			"comment": "fragment: hypgfr2",
			"translation": " đã tỏ ra dè dặt khi thảo luận về kỳ vọng của họ đối với {0}."
		}, {
			"value": "was spot on as the game has received very positive reviews.",
			"comment": "fragment",
			"translation": "đã hoàn toàn chính xác vì trò chơi đã nhận được những đánh giá rất tích cực."
		}, {
			"value": "was just humble as the game received critical acclaim.",
			"comment": "fragment",
			"translation": "chỉ khiêm tốn thôi vì trò chơi đã nhận được sự hoan nghênh của giới phê bình."
		}, {
			"value": "should've been more careful as the final product doesn't match the hyped expectations.",
			"comment": "fragment",
			"translation": "lẽ ra nên cẩn thận hơn vì sản phẩm cuối cùng không đáp ứng được những kỳ vọng được thổi phồng."
		}, {
			"value": "was right to stay realistic as the game is good but nothing too our of the ordinary.",
			"comment": "fragment",
			"translation": "đã đúng khi giữ thái độ thực tế vì trò chơi hay nhưng không có gì quá nổi bật."
		}, {
			"value": "needs a lesson in how to be humble as the game received mediocre reviews.",
			"comment": "fragment",
			"translation": "cần một bài học về sự khiêm tốn vì trò chơi nhận được những đánh giá tầm thường."
		}, {
			"value": "Now, that the game is out on the market the consensus is that {0} {1}",
			"comment": "{0} is player name, {1} is description",
			"translation": "Giờ đây, khi trò chơi đã có mặt trên thị trường, sự đồng thuận là {0} {1}"
		}, {
			"value": "Overall, this had a negative effect on sales.",
			"translation": "Nhìn chung, điều này đã có tác động tiêu cực đến doanh số."
		}, {
			"value": "Steam initialization failed",
			"translation": "Khởi tạo Steam thất bại"
		}, {
			"value": "Zombies",
			"comment": "game topic",
			"translation": "Thây ma"
		}, {
			"value": "After publishing a game you can invest a little bit of time to analyze your creation and generate a game report. Game reports are a great way to gain research points as well as valuable insights into what works and what doesn't work when developing a game.{n}To generate a game report close this message and then {0} anywhere on the screen to bring up the action menu.",
			"comment": "{0} click/touch verb",
			"translation": "Sau khi phát hành một trò chơi, bạn có thể dành một chút thời gian để phân tích sản phẩm của mình và tạo báo cáo trò chơi. Báo cáo trò chơi là một cách tuyệt vời để nhận điểm nghiên cứu cũng như những hiểu biết giá trị về những gì hiệu quả và không hiệu quả khi phát triển trò chơi.{n}Để tạo báo cáo trò chơi, hãy đóng thông báo này và sau đó {0} vào bất kỳ đâu trên màn hình để mở menu hành động."
		}, {
			"value": "If you ever want to review the tutorial messages then you can do so in the Help menu. To access the Help menu and other features such as saving, loading and creating a game simply {0}.{n}You can also change game settings by using the Settings charm. To show the charms bar simply {1} You can then {2} on Settings.",
			"comment": "{0} is appbar fragment, {1} is charmsbar fragment, {2} is click/tap verb",
			"translation": "Nếu bạn muốn xem lại các thông báo hướng dẫn, bạn có thể làm như vậy trong menu Trợ giúp. Để truy cập menu Trợ giúp và các tính năng khác như lưu, tải và tạo trò chơi, chỉ cần {0}.{n}Bạn cũng có thể thay đổi cài đặt trò chơi bằng cách sử dụng charm Cài đặt. Để hiển thị thanh charm, chỉ cần {1} Sau đó, bạn có thể {2} vào Cài đặt."
		}, {
			"value": "Main Menu",
			"comment": "heading",
			"translation": "Menu Chính"
		}, {
			"value": "Staff responsibilities",
			"comment": "heading",
			"translation": "Trách nhiệm Nhân viên"
		}, {
			"value": "You need a design specialist to open a research and development lab. You can train someone to become a specialist via the training menu but the option is only available once they have a certain design skill level.{n}You can also train technology specialists which come in handy for later options.",
			"translation": "Bạn cần một chuyên gia thiết kế để mở phòng nghiên cứu và phát triển. Bạn có thể đào tạo ai đó trở thành chuyên gia thông qua menu đào tạo nhưng tùy chọn này chỉ khả dụng khi họ đạt đến một trình độ kỹ năng thiết kế nhất định.{n}Bạn cũng có thể đào tạo các chuyên gia công nghệ, những người sẽ hữu ích cho các tùy chọn sau này."
		}, {
			"value": "To visit the lab simply {0} the screen and drag to the left or use the arrow keys on the keyboard. Alternatively, you can also click on the little R&D Lab information card in the bottom right of the screen.",
			"comment": "{0} click/touch verb",
			"translation": "Để đến phòng lab, chỉ cần {0} vào màn hình và kéo sang trái hoặc sử dụng các phím mũi tên trên bàn phím. Ngoài ra, bạn cũng có thể nhấp vào thẻ thông tin R&D Lab nhỏ ở góc dưới bên phải màn hình."
		}, {
			"value": "To visit the hardware lab simply {0} the screen and drag to the right or use the arrow keys on the keyboard. Alternatively, you can also click on the little Hardware Lab information card in the top left of the screen.",
			"comment": "{0} click/touch verb",
			"translation": "Để đến phòng lab phần cứng, chỉ cần {0} vào màn hình và kéo sang phải hoặc sử dụng các phím mũi tên trên bàn phím. Ngoài ra, bạn cũng có thể nhấp vào thẻ thông tin Hardware Lab nhỏ ở góc trên bên trái màn hình."
		}, {
			"value": "Game Reports",
			"comment": "heading",
			"translation": "Báo cáo Game"
		}, {
			"value": "Get Steam Key",
			"translation": "Lấy Khóa Steam"
		}, {
			"value": "Could not verify app receipt from Windows Store.",
			"translation": "Không thể xác minh biên nhận ứng dụng từ Windows Store."
		}, {
			"value": "Generate game report...",
			"comment": "menu item",
			"translation": "Tạo báo cáo game..."
		}, {
			"value": "Remove Platform",
			"translation": "Xóa Nền tảng"
		}, {
			"value": "You require a developer license to be able to develop for this platform.<br/><br/> Do you want to pay <strong>{0}</strong> to acquire a license for the <strong>{1}</strong>?",
			"translation": "Bạn cần giấy phép nhà phát triển để có thể phát triển cho nền tảng này.<br/><br/> Bạn có muốn trả <strong>{0}</strong> để có được giấy phép cho <strong>{1}</strong> không?"
		}, {
			"value": "Variation {0}",
			"translation": "Biến thể {0}"
		}, {
			"value": "{0} combo",
			"translation": "combo {0}"
		}, {
			"value": "Effect: ",
			"translation": "Hiệu ứng: "
		}, {
			"value": "Since you have played the game before you can choose to use all previously gained hints in this new game.",
			"translation": "Vì bạn đã chơi trò chơi này trước đây, bạn có thể chọn sử dụng tất cả các gợi ý đã thu được trước đó trong trò chơi mới này."
		}, {
			"value": "We have some additional insights:",
			"translation": "Chúng tôi có một số thông tin chuyên sâu bổ sung:"
		}, {
			"value": "Game Report",
			"translation": "Báo cáo Game"
		}, {
			"value": "{0} and {1} is a {2} combination.",
			"translation": "{0} và {1} là một sự kết hợp {2}."
		}, {
			"value": "Importance of {0} for this type of game: {1}",
			"comment": "where {1} is something like --- or +++",
			"translation": "Tầm quan trọng của {0} đối với loại trò chơi này: {1}"
		}, {
			"value": "The market really doesn't like when we publish very similar games too close to each other.",
			"translation": "Thị trường thực sự không thích khi chúng ta phát hành những trò chơi rất giống nhau quá gần nhau."
		}, {
			"value": "{0} is still new to the team.",
			"comment": "{0} is a single name",
			"translation": "{0} vẫn còn mới với đội."
		}, {
			"value": "{0} are still new to the team.",
			"comment": "{0} is a list of names",
			"translation": "{0} vẫn còn mới với đội."
		}, {
			"value": "We should try to focus our entire team on the development of a game.",
			"translation": "Chúng ta nên cố gắng tập trung toàn bộ đội ngũ vào việc phát triển một trò chơi."
		}, {
			"value": "Self-publishing {1} games will be most efficient when we have at least {0} fans. Publishing deals can give us great exposure and help us reach more players.",
			"translation": "Tự phát hành game {1} sẽ hiệu quả nhất khi chúng ta có ít nhất {0} người hâm mộ. Các thỏa thuận phát hành có thể giúp chúng ta quảng bá rộng rãi và tiếp cận nhiều người chơi hơn."
		}, {
			"value": "{0}",
			"comment": "{0} game name",
			"translation": "{0}"
		}, {
			"value": "Cash:",
			"translation": "Tiền mặt:"
		}, {
			"value": "Advanced Options",
			"translation": "Tùy chọn Nâng cao"
		}, {
			"value": "30 years (fast-paced)",
			"translation": "30 năm (tốc độ nhanh)"
		}, {
			"value": "42 years",
			"translation": "42 năm"
		}, {
			"value": "is ready!",
			"comment": "game title is mentioned the line before",
			"translation": "đã sẵn sàng!"
		}, {
			"value": "Acquire license?",
			"translation": "Mua giấy phép?"
		}, {
			"value": "Play the full 30 years of the game, all the way to modern day technology and beyond!",
			"translation": "Chơi trọn vẹn 30 năm của trò chơi, đến tận công nghệ hiện đại và hơn thế nữa!"
		}, {
			"value": "Exit to Desktop",
			"translation": "Thoát ra Màn hình chính"
		}, {
			"value": "On",
			"translation": "Bật"
		}, {
			"value": "When on (default) then insights learned through generating game reports are shown in the UI. Turn this option off for a bigger challenge. (Note: This option does not affect Tutorials in any way.)",
			"translation": "Khi bật (mặc định) thì những thông tin thu được qua việc tạo báo cáo game sẽ được hiển thị trên giao diện người dùng. Tắt tùy chọn này để có thử thách lớn hơn. (Lưu ý: Tùy chọn này không ảnh hưởng đến Hướng dẫn theo bất kỳ cách nào.)"
		}, {
			"value": "Window",
			"translation": "Cửa sổ"
		}, {
			"value": "Update Available",
			"translation": "Có bản cập nhật"
		}, {
			"value": "Please update to the latest version.",
			"translation": "Vui lòng cập nhật lên phiên bản mới nhất."
		}, {
			"value": "End User License Agreement",
			"translation": "Thỏa thuận Cấp phép Người dùng Cuối"
		}, {
			"value": "I Disagree",
			"translation": "Tôi không đồng ý"
		}, {
			"value": "Forum",
			"translation": "Diễn đàn"
		}, {
			"value": "Best to stay in touch or for quick questions.",
			"translation": "Tốt nhất để giữ liên lạc hoặc cho các câu hỏi nhanh."
		}, {
			"value": "Load failed",
			"translation": "Tải thất bại"
		}, {
			"value": "Could not save settings to steam cloud",
			"translation": "Không thể lưu cài đặt lên Steam Cloud"
		}, {
			"value": "Could not load from steam cloud",
			"translation": "Không thể tải từ Steam Cloud"
		}, {
			"value": "Could not load remote settings",
			"translation": "Không thể tải cài đặt từ xa"
		}, {
			"value": "Congratulations on finishing Game Dev Tycoon and thank you for playing! If you enjoyed our little game then please consider telling your friends about it.",
			"translation": "Chúc mừng bạn đã hoàn thành Game Dev Tycoon và cảm ơn bạn đã chơi! Nếu bạn thích trò chơi nhỏ của chúng tôi thì hãy cân nhắc nói với bạn bè của bạn về nó nhé."
		}, {
			"value": "{0} has declined a request for an interview about their current project.\n",
			"translation": "{0} đã từ chối yêu cầu phỏng vấn về dự án hiện tại của họ.\n"
		}, {
			"value": "With {0} only receiving a lukewarm reception, fans are sure to be expecting better from them and we are curious about their next title.",
			"translation": "Với việc {0} chỉ nhận được sự đón nhận thờ ơ, người hâm mộ chắc chắn sẽ mong đợi điều tốt hơn từ họ và chúng tôi rất tò mò về tựa game tiếp theo của họ."
		}, {
			"value": "I don't know",
			"translation": "Tôi không biết"
		}, {
			"value": "positive",
			"translation": "tích cực"
		}, {
			"value": "mixed",
			"translation": "trái chiều"
		}, {
			"value": "Old Engine",
			"translation": "Engine Cũ"
		}, {
			"value": "Boss, our recent decision to {0} our engine {1} was met with {2} responses from fans. Overall we {3} fans and {4}.",
			"translation": "Sếp ơi, quyết định gần đây của chúng ta về việc {0} engine {1} của chúng ta đã nhận được phản hồi {2} từ người hâm mộ. Nhìn chung, chúng ta {3} người hâm mộ và {4}."
		}, {
			"value": "lost",
			"translation": "mất"
		}, {
			"value": "Pay for license ({0})",
			"translation": "Trả tiền bản quyền ({0})"
		}, {
			"value": "Rally fans! [~{0}% chance]",
			"translation": "Kêu gọi người hâm mộ! [~{0}% cơ hội]"
		}, {
			"value": "Unfortunately, it seems that the patent infringement case was decided against us. We have to pay the full amount of {0} as well as the court costs of {1}. This is ridiculous.",
			"translation": "Thật không may, có vẻ như vụ kiện vi phạm bằng sáng chế đã được quyết định chống lại chúng ta. Chúng ta phải trả toàn bộ số tiền {0} cũng như chi phí tòa án là {1}. Điều này thật vô lý."
		}, {
			"value": "All Your IP Belongs To US",
			"translation": "Tất Cả IP Của Bạn Thuộc Về Chúng Tôi"
		}, {
			"value": "Could not load game",
			"translation": "Không thể tải game"
		}, {
			"value": "bad",
			"translation": "tệ"
		}, {
			"value": "Audience match:",
			"translation": "Đối tượng phù hợp:"
		}, {
			"value": "Genre match:",
			"translation": "Thể loại phù hợp:"
		}, {
			"value": "not important",
			"translation": "không quan trọng"
		}, {
			"value": "quite important",
			"translation": "khá quan trọng"
		}, {
			"value": "After a massive public backlash to the controversial features announced for the upcoming mBox One, Mirconoft has today published a letter outlining their change of plans. The mBox One will no longer require a constant internet connection and will not place restrictions on how games are sold or shared.{n}Clearly the different and much more popular strategies of companies like {0}, as well as vocal players themselves, have forced this change of direction.",
			"translation": "Sau phản ứng dữ dội của công chúng đối với các tính năng gây tranh cãi được công bố cho mBox One sắp ra mắt, Mirconoft hôm nay đã công bố một lá thư nêu rõ sự thay đổi kế hoạch của họ. mBox One sẽ không còn yêu cầu kết nối internet liên tục và sẽ không đặt ra các hạn chế về cách bán hoặc chia sẻ trò chơi.{n}Rõ ràng là các chiến lược khác biệt và phổ biến hơn nhiều của các công ty như {0}, cũng như chính những người chơi lên tiếng, đã buộc phải thay đổi hướng đi này."
		}, {
			"value": "A first test left some players feeling a little motion-sick but with the right game this technology can surely deliver a new level of immersion.",
			"translation": "Một thử nghiệm ban đầu khiến một số người chơi cảm thấy hơi chóng mặt nhưng với trò chơi phù hợp, công nghệ này chắc chắn có thể mang lại một cấp độ nhập vai mới."
		}, {
			"value": "The worldwide game developers guild has awarded {0}, CEO of {1} the lifetime achievement award for contributions to the game industry. {0} has, during a stunning {3} year career at {1} delivered many ground breaking games.{n}The company is most recently known for {2}.",
			"translation": "Hiệp hội các nhà phát triển game toàn cầu đã trao giải thưởng thành tựu trọn đời cho {0}, CEO của {1} vì những đóng góp cho ngành công nghiệp game. {0}, trong suốt {3} năm sự nghiệp đáng kinh ngạc tại {1}, đã mang đến nhiều trò chơi đột phá.{n}Công ty gần đây được biết đến nhiều nhất với {2}."
		}, {
			"value": "Better user experience",
			"translation": "Trải nghiệm người dùng tốt hơn"
		}, {
			"value": "Visorius Support",
			"translation": "Hỗ trợ Visorius"
		}, {
			"value": "Our review inspired by the game's name: bad review #{0}.",
			"translation": "Đánh giá của chúng tôi lấy cảm hứng từ tên trò chơi: đánh giá tệ #{0}."
		}, {
			"value": "It's better than the name.",
			"translation": "Nó hay hơn cái tên."
		}, {
			"value": "11 out of 10. Nuff said.",
			"translation": "11/10. Không cần nói nhiều."
		}, {
			"value": "11 out of 10. Rules don't apply to this outstanding game.",
			"translation": "11/10. Quy tắc không áp dụng cho trò chơi xuất sắc này."
		}, {
			"value": "Overall, this had a positive effect on sales.",
			"translation": "Nhìn chung, điều này có tác động tích cực đến doanh số bán hàng."
		}, {
			"value": "No response from server. Please try again later.",
			"translation": "Không có phản hồi từ máy chủ. Vui lòng thử lại sau."
		}, {
			"value": "Could not get app receipt from Windows Store.",
			"translation": "Không thể lấy biên nhận ứng dụng từ Windows Store."
		}, {
			"value": "Would you like to import all previously gained hints into this game?",
			"translation": "Bạn có muốn nhập tất cả các gợi ý đã thu được trước đó vào trò chơi này không?"
		}, {
			"value": "No new insights",
			"translation": "Không có thông tin mới"
		}, {
			"value": "Our post-release analysis of {0} is complete and we got the following results:",
			"translation": "Phân tích sau phát hành của chúng tôi về {0} đã hoàn tất và chúng tôi có kết quả sau:"
		}, {
			"value": "{0} seems to be {1} for this type of game.",
			"translation": "{0} có vẻ {1} đối với loại trò chơi này."
		}, {
			"value": "The optimal team size for a {0} game seems to be {1}.",
			"translation": "Quy mô đội tối ưu cho một trò chơi {0} dường như là {1}."
		}, {
			"value": "A few more games and the team will have higher potential",
			"translation": "Thêm một vài trò chơi nữa và đội sẽ có tiềm năng cao hơn"
		}, {
			"value": "Our fan base is big enough to make self-publishing {0} games viable. Unless a publishing deal gives us a great royalty rate we are likely better off publishing {0} games ourselves",
			"translation": "Lượng người hâm mộ của chúng ta đủ lớn để việc tự phát hành game {0} trở nên khả thi. Trừ khi một thỏa thuận phát hành mang lại cho chúng ta tỷ lệ tiền bản quyền lớn, nếu không chúng ta có lẽ nên tự phát hành game {0}"
		}, {
			"value": "Game Length",
			"translation": "Thời lượng Game"
		}, {
			"value": "35 years (recommended)",
			"translation": "35 năm (khuyến nghị)"
		}, {
			"value": "Note: You can always continue playing after the main game is over. The game length simply specifies how fast new platforms come to market and when the high score is calculated.",
			"translation": "Lưu ý: Bạn luôn có thể tiếp tục chơi sau khi trò chơi chính kết thúc. Thời lượng trò chơi chỉ đơn giản xác định tốc độ ra mắt của các nền tảng mới và thời điểm tính điểm cao."
		}, {
			"value": "Off",
			"translation": "Tắt"
		}, {
			"value": "Audio",
			"translation": "Âm thanh"
		}, {
			"value": "Toggle Fullscreen",
			"translation": "Chuyển đổi Toàn màn hình"
		}, {
			"value": "A newer version of this game is available.",
			"translation": "Một phiên bản mới hơn của trò chơi này đã có sẵn."
		}, {
			"value": "Get Update",
			"translation": "Cập nhật"
		}, {
			"value": "I Agree",
			"translation": "Tôi đồng ý"
		}, {
			"value": "Exit",
			"translation": "Thoát"
		}, {
			"value": "Best for discussions, tips and tricks and to communicate with other fans.",
			"translation": "Tốt nhất cho các cuộc thảo luận, mẹo và thủ thuật và để giao tiếp với những người hâm mộ khác."
		}, {
			"value": "Language",
			"translation": "Ngôn ngữ"
		}, {
			"value": "Changes to the language setting require a restart.",
			"translation": "Thay đổi cài đặt ngôn ngữ yêu cầu khởi động lại."
		}, {
			"value": "We see that you are in financial difficulties. Since you've just released your latest game {0}, we are willing to offer you a mini-credit to get you over this months' payments.\n\nWe will give you {1} to cover your costs and expect to be paid back the full amount, plus a small adminstration fee of {2} in two months time.",
			"translation": "Chúng tôi thấy bạn đang gặp khó khăn về tài chính. Vì bạn vừa phát hành trò chơi mới nhất của mình {0}, chúng tôi sẵn sàng cung cấp cho bạn một khoản tín dụng nhỏ để giúp bạn vượt qua các khoản thanh toán trong tháng này.\n\nChúng tôi sẽ cung cấp cho bạn {1} để trang trải chi phí và mong bạn hoàn trả toàn bộ số tiền, cộng với một khoản phí quản lý nhỏ là {2} trong vòng hai tháng."
		}, {
			"value": "Boss, our office could really do with some renovation work and our computer systems are also out of date. Investing a little bit in a more modern office and upgraded computers would be a great.\nDo you want to renovate the office?",
			"translation": "Sếp ơi, văn phòng của chúng ta thực sự cần một số công việc cải tạo và hệ thống máy tính của chúng ta cũng đã lỗi thời. Đầu tư một chút vào một văn phòng hiện đại hơn và máy tính được nâng cấp sẽ rất tuyệt.\nSếp có muốn cải tạo văn phòng không?"
		}, {
			"value": "Dear {0}!\nSince G3 has become the biggest meetup of game developers every year we have decided to use our name for the greater good. Starting today we offer different game development challenges throughout the year where game devs from around the world can compete with each other.{n}This will be a great way for game developers to learn something new. You are welcome to join in at any time. There are no prizes but it should be a great way to increase everyone's skills.\nThe G3 committee.",
			"comment": "{0} company name",
			"translation": "Kính gửi {0}!\nVì G3 đã trở thành cuộc gặp gỡ lớn nhất của các nhà phát triển game hàng năm, chúng tôi đã quyết định sử dụng tên của mình cho mục đích tốt đẹp hơn. Bắt đầu từ hôm nay, chúng tôi tổ chức các thử thách phát triển game khác nhau trong suốt cả năm, nơi các nhà phát triển game từ khắp nơi trên thế giới có thể cạnh tranh với nhau.{n}Đây sẽ là một cách tuyệt vời để các nhà phát triển game học hỏi những điều mới. Bạn luôn được chào đón tham gia bất cứ lúc nào. Không có giải thưởng nhưng đó sẽ là một cách tuyệt vời để nâng cao kỹ năng của mọi người.\nỦy ban G3."
		}, {
			"value": "Hi, this is {0} from {1}. I got word that {2} is working on a new game.\nWould you be willing to share some information on your current game project and do an interview about it?",
			"translation": "Chào bạn, tôi là {0} từ {1}. Tôi nghe nói rằng {2} đang phát triển một trò chơi mới.\nBạn có sẵn lòng chia sẻ một số thông tin về dự án game hiện tại của mình và thực hiện một cuộc phỏng vấn về nó không?"
		}, {
			"value": "{0}:\nWhat is your expectation regarding the success of {1}? Do you think that the game will be well received?",
			"translation": "{0}:\nKỳ vọng của bạn về sự thành công của {1} là gì? Bạn có nghĩ rằng trò chơi sẽ được đón nhận tốt không?"
		}, {
			"value": "{0}:\nMany of our readers are curious about what decisions go into making a video game and how companies prioritize development areas.\nYour new game is a {1}/{2} game, can you tell us whether such a game would usually receive more focus on {3} or on {4}?",
			"translation": "{0}:\nNhiều độc giả của chúng tôi tò mò về những quyết định đằng sau việc tạo ra một trò chơi điện tử và cách các công ty ưu tiên các lĩnh vực phát triển.\nTrò chơi mới của bạn là một trò chơi {1}/{2}, bạn có thể cho chúng tôi biết liệu một trò chơi như vậy thường sẽ tập trung nhiều hơn vào {3} hay {4} không?"
		}, {
			"value": "In a recent interview with {0} we discussed their upcoming {1} game and asked company founder {2} how different development areas are prioritized.\nIn the interview {2} said that {3} is of particular importance for such a game ",
			"comment": "continues with fragment",
			"translation": "Trong một cuộc phỏng vấn gần đây với {0}, chúng tôi đã thảo luận về trò chơi {1} sắp tới của họ và hỏi người sáng lập công ty {2} về cách các lĩnh vực phát triển khác nhau được ưu tiên.\nTrong cuộc phỏng vấn, {2} nói rằng {3} có tầm quan trọng đặc biệt đối với một trò chơi như vậy "
		}, {
			"value": "Boss, a small number of dedicated fans have asked that we release the source code to one of our older game engines '{0}'. Doing so would surely satisfy these fans but given that we worked hard on the engine, we could also sell licenses for it and make some money. Alternatively, we could simply refuse their request completely.\nWhat would you like to do?",
			"translation": "Sếp ơi, một số ít người hâm mộ tận tâm đã yêu cầu chúng ta phát hành mã nguồn của một trong những engine game cũ của chúng ta '{0}'. Làm như vậy chắc chắn sẽ làm hài lòng những người hâm mộ này nhưng vì chúng ta đã làm việc chăm chỉ với engine đó, chúng ta cũng có thể bán giấy phép cho nó và kiếm một ít tiền. Hoặc, chúng ta có thể từ chối hoàn toàn yêu cầu của họ.\nSếp muốn làm gì?"
		}, {
			"value": "We've just received a letter from a company called 'All Your IP Belongs To US' and they say that our engine {0} is infringing on one of their patents.{n}They 'graciously' offer a license to their patent for {1} and are willing to give us a 50% discount if we just pay them without fighting them in court. We could pay this and hope that they won't bother us again or we could refuse and try to resolve this in front of the courts. Alternatively we might be able to rally our fans and publicly fight them.\nHow would you like to proceed?",
			"translation": "Chúng ta vừa nhận được một lá thư từ một công ty có tên 'Tất Cả IP Của Bạn Thuộc Về Chúng Tôi' và họ nói rằng engine {0} của chúng ta đang vi phạm một trong những bằng sáng chế của họ.{n}Họ 'hào phóng' đề nghị cấp phép bằng sáng chế của họ với giá {1} và sẵn sàng giảm giá 50% nếu chúng ta trả tiền cho họ mà không cần kiện tụng. Chúng ta có thể trả tiền và hy vọng họ sẽ không làm phiền chúng ta nữa hoặc chúng ta có thể từ chối và cố gắng giải quyết vấn đề này trước tòa. Hoặc, chúng ta có thể kêu gọi người hâm mộ của mình và công khai chống lại họ.\nSếp muốn tiến hành như thế nào?"
		}, {
			"value": "Analysts have observed a strange trend lately where players around the world seem to have developed a curious taste for unusual games.{n}As one player put it: 'Sometimes you just want to play something unique. A game based on an idea that's not the usual Military/Action game or Fantasy/RPG just to name two examples.\nI really hope companies bring some unique games to market soon. I would definitely prefer them right now.'{n}This new trend promises to bring an interesting challenge to game developers as topic/genre combinations which used to work well will suddenly be less favorable while more outlandish ideas might flourish.",
			"translation": "Các nhà phân tích gần đây đã quan sát thấy một xu hướng kỳ lạ, nơi người chơi trên toàn thế giới dường như đã phát triển một sở thích tò mò đối với các trò chơi khác thường.{n}Như một người chơi đã nói: 'Đôi khi bạn chỉ muốn chơi một cái gì đó độc đáo. Một trò chơi dựa trên một ý tưởng không phải là trò chơi Quân sự/Hành động thông thường hay Giả tưởng/RPG chỉ để kể tên hai ví dụ.\nTôi thực sự hy vọng các công ty sẽ sớm đưa ra thị trường những trò chơi độc đáo. Tôi chắc chắn sẽ thích chúng hơn ngay bây giờ.'{n}Xu hướng mới này hứa hẹn sẽ mang đến một thách thức thú vị cho các nhà phát triển game vì các kết hợp chủ đề/thể loại từng hoạt động tốt sẽ đột nhiên kém thuận lợi hơn trong khi những ý tưởng kỳ lạ hơn có thể phát triển mạnh."
		}, {
			"value": "{0} is no longer supported.\nYou've released {1} game for the platform and earned a total of {2}!",
			"translation": "{0} không còn được hỗ trợ nữa.\nBạn đã phát hành {1} trò chơi cho nền tảng này và kiếm được tổng cộng {2}!"
		}, {
			"value": "Ninvento has revealed that their bid in the next generation of consoles will be called the Wuu. The new console features a controller with a integrated display.{n}This is said to make local multiplayer games much more interesting by giving each player a unique screen. Ninvento has always been at the forefront of innovation and this console seems, once again, to be a brave move.\nThe Wuu is said to be available {0}.",
			"comment": "{0} is date referral sentence fragment",
			"translation": "Ninvento đã tiết lộ rằng sự tham gia của họ vào thế hệ console tiếp theo sẽ được gọi là Wuu. Hệ máy mới này có một bộ điều khiển với màn hình tích hợp.{n}Điều này được cho là sẽ làm cho các trò chơi nhiều người chơi cục bộ trở nên thú vị hơn nhiều bằng cách cung cấp cho mỗi người chơi một màn hình độc đáo. Ninvento luôn đi đầu trong đổi mới và hệ máy này dường như, một lần nữa, là một bước đi táo bạo.\nWuu được cho là sẽ có mặt {0}."
		}, {
			"value": "Just as the industry seems to have silently accepted the slow demise of PC gaming as more and more games are primarily developed for consoles, there seems to be a resurgence of the PC market.{n}New powerful and affordable hardware, a growing indie-developer scene and the rise of crowd-funded financing has meant a slew of new exciting projects hitting the PC market.\nIt seems that the PC market will only grow stronger in the coming years.{n}For console lovers, this isn't bad news either as many PC games are also ported to the most successful consoles.",
			"translation": "Ngay khi ngành công nghiệp dường như đã âm thầm chấp nhận sự suy tàn chậm chạp của game PC khi ngày càng nhiều trò chơi chủ yếu được phát triển cho console, thì dường như thị trường PC đang hồi sinh.{n}Phần cứng mới mạnh mẽ và giá cả phải chăng, một cộng đồng nhà phát triển độc lập đang phát triển và sự gia tăng của tài trợ cộng đồng đã mang đến một loạt các dự án mới thú vị tấn công thị trường PC.\nCó vẻ như thị trường PC sẽ chỉ ngày càng mạnh mẽ hơn trong những năm tới.{n}Đối với những người yêu thích console, đây cũng không phải là tin xấu vì nhiều game PC cũng được chuyển thể sang các hệ máy console thành công nhất."
		}, {
			"value": "Welcome to Game Dev Tycoon!\nIn this business simulation you have been transported back in time to start your very own game development company right at the beginning of the PC revolution. In the next {0} years you can build your dream company, create best selling games, gain fans and become the leader of the market.{n}Before you can start your adventure you have to give your upcoming company a name.",
			"translation": "Chào mừng đến với Game Dev Tycoon!\nTrong trò chơi mô phỏng kinh doanh này, bạn đã được đưa trở lại quá khứ để thành lập công ty phát triển game của riêng mình ngay từ buổi đầu của cuộc cách mạng PC. Trong {0} năm tới, bạn có thể xây dựng công ty mơ ước của mình, tạo ra những trò chơi bán chạy nhất, thu hút người hâm mộ và trở thành người dẫn đầu thị trường.{n}Trước khi bạn có thể bắt đầu cuộc phiêu lưu của mình, bạn phải đặt tên cho công ty sắp tới của mình."
		}, {
			"value": "It seems that {0} has recently moved into an office in a well known technology park and is now searching for employees.{n}The company, which is known for games such as {1}, has reportedly operated out of a garage until now.{n}One of the many fans of {2} commented: 'I can't believe that they didn't even have a proper office until now and that those games were created by only one person!\nI am really looking forward to their future games!",
			"translation": "Có vẻ như {0} gần đây đã chuyển đến một văn phòng trong một khu công nghệ nổi tiếng và hiện đang tìm kiếm nhân viên.{n}Công ty, được biết đến với các trò chơi như {1}, được cho là đã hoạt động trong một nhà để xe cho đến nay.{n}Một trong nhiều người hâm mộ của {2} đã bình luận: 'Tôi không thể tin được rằng họ thậm chí còn không có một văn phòng tử tế cho đến bây giờ và những trò chơi đó được tạo ra bởi chỉ một người!\nTôi thực sự mong chờ những trò chơi trong tương lai của họ!"
		}, {
			"value": "Uncaught error. Please report this to {0}: \n{1}\n({2}:{3})\n\nPlease restart the game.",
			"translation": "Lỗi không xác định. Vui lòng báo cáo điều này cho {0}: \n{1}\n({2}:{3})\n\nVui lòng khởi động lại trò chơi."
		}, {
			"value": "Game development has now started.{n}While developing your game you will generate game points which you can see bubbling up.\nGame points are divided into design points and technology points. The more points you generate the better the game will be.{n}From time to time there will also be bug points generated. These points become less likely once you gain experience. Bugs should be fixed before the game is released and increase development time and cost.",
			"translation": "Quá trình phát triển game đã bắt đầu.{n}Trong khi phát triển game, bạn sẽ tạo ra điểm game mà bạn có thể thấy chúng nổi lên.\nĐiểm game được chia thành điểm thiết kế và điểm công nghệ. Bạn càng tạo ra nhiều điểm thì game càng tốt.{n}Thỉnh thoảng cũng sẽ có điểm lỗi được tạo ra. Những điểm này sẽ ít xuất hiện hơn khi bạn có kinh nghiệm. Lỗi nên được sửa trước khi phát hành game và chúng làm tăng thời gian và chi phí phát triển."
		}, {
			"value": "Creating larger games is a significant task and, unlike in small games, one person cannot effectively be responsible for every aspect of a game.\nTo create a good game and to make best use of your team you will have to assign which of your team is responsible for which areas.{n}Pick team members whose skills match the area to get the best result.\nWhen you assign a team member responsibilities you will see their workload. Try not to overload them too much.",
			"translation": "Tạo ra các trò chơi lớn hơn là một nhiệm vụ quan trọng và, không giống như các trò chơi nhỏ, một người không thể chịu trách nhiệm hiệu quả cho mọi khía cạnh của trò chơi.\nĐể tạo ra một trò chơi hay và tận dụng tốt nhất đội ngũ của bạn, bạn sẽ phải phân công ai trong đội của bạn chịu trách nhiệm cho lĩnh vực nào.{n}Chọn các thành viên trong đội có kỹ năng phù hợp với lĩnh vực đó để đạt được kết quả tốt nhất.\nKhi bạn giao trách nhiệm cho một thành viên trong đội, bạn sẽ thấy khối lượng công việc của họ. Cố gắng đừng giao quá nhiều việc cho họ."
		}, {
			"value": "While generating game reports you start to gain insights into the development process and learn about what works well and what doesn't work so well.\nThese insights are shown as hints on the development screen (unless you have turned this option off in the settings).{n}The hints range from '+++' to '--' and indicate how important an area is for this type of game. When hints have a question mark at the end (e.g. '+++?') it means that you have insights from a game in the same genre but that you are not yet sure whether this holds true for this particular genre/topic combination.",
			"translation": "Trong khi tạo báo cáo game, bạn bắt đầu có được những hiểu biết sâu sắc về quy trình phát triển và tìm hiểu về những gì hoạt động tốt và những gì không hoạt động tốt.\nNhững hiểu biết này được hiển thị dưới dạng gợi ý trên màn hình phát triển (trừ khi bạn đã tắt tùy chọn này trong cài đặt).{n}Các gợi ý dao động từ '+++' đến '--' và cho biết tầm quan trọng của một lĩnh vực đối với loại trò chơi này. Khi các gợi ý có dấu chấm hỏi ở cuối (ví dụ: '+++?'), điều đó có nghĩa là bạn có thông tin chi tiết từ một trò chơi cùng thể loại nhưng bạn chưa chắc chắn liệu điều này có đúng với sự kết hợp thể loại/chủ đề cụ thể này hay không."
		}, {
			"value": "Game reports are a great way to gain more research points and new insights. It pays off to generate a report for each game you release.\nNow that you've completed your first game report it's a good idea to look at the research menu.\nTo open the research menu close this message and then {0} anywhere on the screen to bring up the action menu.",
			"comment": "{0} click/touch verb",
			"translation": "Báo cáo game là một cách tuyệt vời để thu thập thêm điểm nghiên cứu và những hiểu biết mới. Việc tạo báo cáo cho mỗi trò chơi bạn phát hành sẽ mang lại lợi ích.\nBây giờ bạn đã hoàn thành báo cáo game đầu tiên của mình, đây là một ý tưởng hay để xem xét menu nghiên cứu.\nĐể mở menu nghiên cứu, hãy đóng thông báo này và sau đó {0} vào bất kỳ đâu trên màn hình để mở menu hành động."
		}, {
			"value": "To: {0}\nFrom: Patrick & Daniel Klug (Greenheart Games).\nHi {0}, we are the creators of Game Dev Tycoon and would like to thank you very much for purchasing the game and supporting us.{n}Game Dev Tycoon is our very first game and it means a lot to us that you are enjoying it. With your purchase you support our little start-up and this will hopefully make sure that we can bring you more games in the future.{n}Seriously, you rock! Thank you very much and have fun with Game Dev Tycoon.",
			"translation": "Gửi: {0}\nTừ: Patrick & Daniel Klug (Greenheart Games).\nChào {0}, chúng tôi là những người tạo ra Game Dev Tycoon và xin chân thành cảm ơn bạn đã mua trò chơi và ủng hộ chúng tôi.{n}Game Dev Tycoon là trò chơi đầu tiên của chúng tôi và điều đó có ý nghĩa rất lớn đối với chúng tôi khi bạn yêu thích nó. Với việc mua hàng của bạn, bạn đã hỗ trợ công ty khởi nghiệp nhỏ của chúng tôi và điều này hy vọng sẽ đảm bảo rằng chúng tôi có thể mang đến cho bạn nhiều trò chơi hơn trong tương lai.{n}Nghiêm túc mà nói, bạn thật tuyệt vời! Cảm ơn bạn rất nhiều và chúc bạn vui vẻ với Game Dev Tycoon."
		}, {
			"value": "We see that you are, again, in serious financial difficulties. We are willing to offer you a mini-credit to tie you over until your current game is on the market.\n\nWe will give you {1} to cover your costs and expect to be paid back the full amount, plus a fee of {2}, one month after the game is released.",
			"translation": "Chúng tôi thấy rằng bạn, một lần nữa, đang gặp khó khăn tài chính nghiêm trọng. Chúng tôi sẵn sàng cung cấp cho bạn một khoản tín dụng nhỏ để giúp bạn vượt qua cho đến khi trò chơi hiện tại của bạn được tung ra thị trường.\n\nChúng tôi sẽ cung cấp cho bạn {1} để trang trải chi phí và mong bạn hoàn trả toàn bộ số tiền, cộng với một khoản phí {2}, một tháng sau khi trò chơi được phát hành."
		}, {
			"value": "Loading ...",
			"translation": "Đang tải ..."
		}, {
			"value": "Unlock hints?",
			"translation": "Mở khóa gợi ý?"
		}, {
			"value": " fans",
			"translation": " người hâm mộ"
		}, {
			"value": "Credits",
			"translation": "Ghi công"
		}, {
			"value": "Hype game!",
			"translation": "Tạo Hype cho game!"
		}, {
			"value": "Be modest.",
			"translation": "Khiêm tốn thôi."
		}, {
			"value": "Mods",
			"translation": "Mod"
		}, {
			"value": "Industry Report",
			"translation": "Báo cáo Ngành"
		}, {
			"value": "Platform genre-match ({0}/{1}): {2}.",
			"translation": "Độ hợp Nền tảng-Thể loại ({0}/{1}): {2}."
		}, {
			"value": "Platform audience-match ({0}/{1}): {2}.",
			"translation": "Độ hợp Nền tảng-Đối tượng ({0}/{1}): {2}."
		}, {
			"value": "Topic audience-match ({0}/{1}): {2}.",
			"translation": "Độ hợp Chủ đề-Đối tượng ({0}/{1}): {2}."
		}, {
			"value": "Enabling and disabling mods requires a restart.",
			"translation": "Bật và tắt mod yêu cầu khởi động lại."
		}, {
			"value": "Use mods at your own risk!",
			"translation": "Sử dụng mod với rủi ro tự chịu!"
		}, {
			"value": "Greenheart Games is not responsible for the contents of mods. Mods may corrupt your save files or do other harm. Use them at your own risk! Since mods can introduce severe bugs or data corruption we cannot offer user support when mods are in use.",
			"translation": "Greenheart Games không chịu trách nhiệm về nội dung của các mod. Mod có thể làm hỏng tệp lưu của bạn hoặc gây ra các tác hại khác. Hãy sử dụng chúng với rủi ro tự chịu! Vì mod có thể gây ra lỗi nghiêm trọng hoặc hỏng dữ liệu, chúng tôi không thể hỗ trợ người dùng khi đang sử dụng mod."
		}, {
			"value": "patch complete",
			"translation": "vá lỗi hoàn tất"
		}, {
			"value": "Give it away",
			"translation": "Cho đi"
		}, {
			"value": "Sell it",
			"translation": "Bán nó"
		}, {
			"value": "Refuse",
			"translation": "Từ chối"
		}, {
			"value": "Out of nowhere, a new company called KickIT has kicked up a media storm by successfully crowd-funding the development of a new gaming console in just under eight hours.{n}The console, dubbed 'OYA', uses similar technology as modern phones and tablets and delivers games exclusively via its own online store.\nThe OYA is a cubed-shape console and much smaller than most gamepads but the shape isn't the only thing that is small as the developer states that the price tag of the OYA will be under 100cr.{n} KickIT also stated that every game on the OYA will offer a free DEMO. The OYA will be available {0}.",
			"translation": "Từ hư không, một công ty mới tên là KickIT đã gây bão truyền thông bằng cách huy động vốn cộng đồng thành công cho việc phát triển một hệ máy chơi game mới chỉ trong vòng chưa đầy tám giờ.{n}Hệ máy này, được mệnh danh là 'OYA', sử dụng công nghệ tương tự như điện thoại và máy tính bảng hiện đại và cung cấp game độc quyền qua cửa hàng trực tuyến của riêng mình.\nOYA là một hệ máy hình khối và nhỏ hơn nhiều so với hầu hết các tay cầm chơi game nhưng hình dạng không phải là thứ duy nhất nhỏ bé vì nhà phát triển tuyên bố rằng giá của OYA sẽ dưới 100cr.{n} KickIT cũng tuyên bố rằng mọi trò chơi trên OYA sẽ cung cấp bản DEMO miễn phí. OYA sẽ có mặt trên thị trường {0}."
		}, {
			"value": "Game dev gems",
			"translation": "Tinh hoa phát triển game"
		}, {
			"value": "Make me think!",
			"translation": "Hãy làm tôi suy nghĩ!"
		}, {
			"value": "Game design for pirates",
			"translation": "Thiết kế game cho cướp biển"
		}, {
			"value": "Don't repeat yourself",
			"translation": "Đừng lặp lại chính mình"
		}, {
			"value": "Code incomplete",
			"translation": "Mã nguồn chưa hoàn chỉnh"
		}, {
			"value": "If you ever want to review the tutorial messages then you can do so in the Help menu. To access the Help menu and other features such as saving, loading and creating a game simply press ESC to access the main menu.",
			"translation": "Nếu bạn muốn xem lại các thông báo hướng dẫn, bạn có thể làm điều đó trong menu Trợ giúp. Để truy cập menu Trợ giúp và các tính năng khác như lưu, tải và tạo trò chơi, chỉ cần nhấn ESC để truy cập menu chính."
		}, {
			"value": "Your local save game seems to be different from the one stored in the Steam Cloud. Which one would you like to load?",
			"translation": "Tệp lưu cục bộ của bạn có vẻ khác với tệp được lưu trữ trên Steam Cloud. Bạn muốn tải tệp nào?"
		}, {
			"value": "Cloud",
			"comment": "savegame",
			"translation": "Đám mây"
		}, {
			"value": "Local",
			"comment": "savegame",
			"translation": "Cục bộ"
		}, {
			"value": "Note: Once you save the game, the new save file will be stored both locally and on the Cloud unless you disable the Steam Cloud through Steam.",
			"translation": "Lưu ý: Sau khi bạn lưu trò chơi, tệp lưu mới sẽ được lưu trữ cả cục bộ và trên Đám mây trừ khi bạn tắt Steam Cloud thông qua Steam."
		}, {
			"value": "Moderators",
			"comment": "localization",
			"translation": "Điều hành viên"
		}, {
			"value": "Top Contributors",
			"comment": "localization",
			"translation": "Người đóng góp hàng đầu"
		}, {
			"value": "Quality Assurance",
			"comment": "localization",
			"translation": "Đảm bảo Chất lượng"
		}, {
			"value": "Discuss translation",
			"translation": "Thảo luận bản dịch"
		}, {
			"value": "Thanks to the many unnamed contributors who greatly helped translating the game!",
			"translation": "Cảm ơn rất nhiều những người đóng góp ẩn danh đã giúp đỡ rất nhiều trong việc dịch trò chơi!"
		}, {
			"value": "Any",
			"comment": "shown underneath the Any platform icon in publisher contracts",
			"translation": "Bất kỳ"
		}, {
			"value": "Right away!",
			"translation": "Ngay lập tức!"
		}, {
			"value": "{0}K",
			"translation": "{0}K"
		}, {
			"value": "{0}M",
			"translation": "{0}Tr"
		}, {
			"value": "{0} %",
			"translation": "{0} %"
		}, {
			"value": "Show only new tutorials (recommended)",
			"translation": "Chỉ hiển thị hướng dẫn mới (khuyên dùng)"
		}, {
			"value": "Show all tutorials",
			"translation": "Hiển thị tất cả hướng dẫn"
		}, {
			"value": "Disable tutorials",
			"translation": "Tắt hướng dẫn"
		}, {
			"value": "Quality",
			"translation": "Chất lượng"
		}, {
			"value": "Performance",
			"translation": "Hiệu năng"
		}, {
			"value": "Animations",
			"translation": "Hoạt ảnh"
		}, {
			"value": "Sign up to our newsletter",
			"translation": "Đăng ký nhận bản tin của chúng tôi"
		}, {
			"value": "Signing up...",
			"translation": "Đang đăng ký..."
		}, {
			"value": "Signup successful!",
			"translation": "Đăng ký thành công!"
		}, {
			"value": "Like this game? Stay informed about new games coming from us by signing up to our newsletter.",
			"translation": "Thích trò chơi này? Hãy cập nhật thông tin về các trò chơi mới của chúng tôi bằng cách đăng ký nhận bản tin."
		}, {
			"value": "email address",
			"translation": "địa chỉ email"
		}, {
			"value": "Sign up",
			"translation": "Đăng ký"
		}, {
			"value": "Load Anyway",
			"translation": "Vẫn tải"
		}, {
			"value": "Abort Loading",
			"translation": "Hủy tải"
		}, {
			"value": "How would you like to proceed?",
			"translation": "Bạn muốn tiếp tục như thế nào?"
		}, {
			"value": "To correct this, activate the same mod(s) that have been used with the save game and deactive any extra mods. If this is intentional however you may wish to continue loading the game.",
			"translation": "Để khắc phục điều này, hãy kích hoạt (các) mod giống như đã được sử dụng với tệp lưu trò chơi và tắt mọi mod bổ sung. Tuy nhiên, nếu đây là cố ý, bạn có thể muốn tiếp tục tải trò chơi."
		}, {
			"value": "This mismatch may cause unwanted issues such as save game corruption making your save unplayable.",
			"translation": "Sự không khớp này có thể gây ra các sự cố không mong muốn như hỏng tệp lưu trò chơi khiến bạn không thể chơi được."
		}, {
			"value": "Additional Mod(s):",
			"translation": "(Các) Mod bổ sung:"
		}, {
			"value": "Missing Mod(s):",
			"translation": "(Các) Mod bị thiếu:"
		}, {
			"value": "There is a mismatch between the mods used in this save game and the mods you currently have active:",
			"translation": "Có sự không khớp giữa các mod được sử dụng trong tệp lưu trò chơi này và các mod bạn hiện đang kích hoạt:"
		}, {
			"value": "This save slot is corrupt, this could be due to a failed cloud sync. Please resync your game with the Steam cloud and try again.",
			"translation": "Ô lưu này bị hỏng, có thể do đồng bộ hóa đám mây không thành công. Vui lòng đồng bộ hóa lại trò chơi của bạn với đám mây Steam và thử lại."
		}, {
			"value": "This save slot is corrupt, this could be due to a failed cloud sync. Please report this issue to Microsoft Support this issue.",
			"translation": "Ô lưu này bị hỏng, có thể do đồng bộ hóa đám mây không thành công. Vui lòng báo cáo sự cố này cho bộ phận Hỗ trợ của Microsoft."
		}, {
			"value": "This save slot is corrupt, please try restarting your game.",
			"translation": "Ô lưu này bị hỏng, vui lòng thử khởi động lại trò chơi của bạn."
		}, {
			"value": "Mods:",
			"translation": "Mod:"
		}, {
			"value": "Tutorials",
			"translation": "Hướng dẫn"
		}, {
			"value": "Hardware",
			"translation": "Phần cứng"
		}, {
			"value": "Messages",
			"comment": "not conflict with Notifications on phones, ideally.",
			"translation": "Tin nhắn"
		}, {
			"value": "Customize which in-game messages will automatically open and which will be added to the message queue on the left-hand side of the screen.",
			"comment": "description appearingn on the message settings panel",
			"translation": "Tùy chỉnh tin nhắn nào trong trò chơi sẽ tự động mở và tin nhắn nào sẽ được thêm vào hàng đợi tin nhắn ở phía bên trái màn hình."
		}, {
			"value": "Auto-open: On",
			"comment": "This is the on state.",
			"translation": "Tự động mở: Bật"
		}, {
			"value": "Auto-open: Off",
			"comment": "This is the off state.",
			"translation": "Tự động mở: Tắt"
		}, {
			"value": "New Research Available",
			"comment": "used as a category for messages",
			"translation": "Nghiên cứu mới có sẵn"
		}, {
			"value": "Company Milestones",
			"comment": "used as a category for messages",
			"translation": "Các cột mốc của Công ty"
		}, {
			"value": "Platform News",
			"comment": "used as a category for messages about gaming console releases",
			"translation": "Tin tức Nền tảng"
		}, {
			"value": "Events",
			"comment": "used as a category for messages, where players are asked to make a decision",
			"translation": "Sự kiện"
		}, {
			"value": "New Best!",
			"translation": "Kỷ lục mới!"
		}, {
			"value": "Additional Features",
			"translation": "Tính năng bổ sung"
		}, {
			"value": "Bonus Hype",
			"translation": "Hype thưởng"
		}, {
			"value": "New Fans",
			"translation": "Fan mới"
		}, {
			"value": "Bonus Sales",
			"translation": "Doanh thu thưởng"
		}, {
			"value": "XP GAINED x {0}",
			"comment": "{0} is a number.",
			"translation": "XP NHẬN ĐƯỢC x {0}"
		}, {
			"value": "Tap to start game ...",
			"translation": "Chạm để bắt đầu trò chơi..."
		}, {
			"value": "Tap to continue ...",
			"translation": "Chạm để tiếp tục..."
		}, {
			"value": "Recording Controls",
			"comment": "screen recording feature",
			"translation": "Điều khiển Ghi hình"
		}, {
			"value": "Start Stream",
			"comment": "screen recording feature",
			"translation": "Bắt đầu Phát trực tiếp"
		}, {
			"value": "Stop Stream",
			"comment": "screen recording feature",
			"translation": "Dừng Phát trực tiếp"
		}, {
			"value": "Report Complete",
			"comment": "Report as in Game Report. It needs to be short in this case.",
			"translation": "Báo cáo Hoàn thành"
		}, {
			"value": "Great Combo",
			"translation": "Combo Tuyệt vời"
		}, {
			"value": "Good Combo",
			"translation": "Combo Tốt"
		}, {
			"value": "Okay Combo",
			"translation": "Combo Tạm được"
		}, {
			"value": "Bad Combo",
			"translation": "Combo Tệ"
		}, {
			"value": "Terrible Combo",
			"translation": "Combo Kinh khủng"
		}, {
			"value": "{0} and {1} is a great combination.",
			"translation": "{0} và {1} là một sự kết hợp tuyệt vời."
		}, {
			"value": "{0} and {1} is a good combination.",
			"translation": "{0} và {1} là một sự kết hợp tốt."
		}, {
			"value": "{0} and {1} is an okay combination.",
			"translation": "{0} và {1} là một sự kết hợp tạm được."
		}, {
			"value": "{0} and {1} is a bad combination.",
			"translation": "{0} và {1} là một sự kết hợp tệ."
		}, {
			"value": "{0} and {1} is a terrible combination.",
			"translation": "{0} và {1} là một sự kết hợp kinh khủng."
		}, {
			"value": "Industry reports indicate that player feedback is an important tool for developers to better understand how players are enjoying their games. With that in mind we hope it is okay to ask you: Are you enjoying Game Dev Tycoon so far?",
			"translation": "Các báo cáo trong ngành cho thấy phản hồi của người chơi là một công cụ quan trọng để các nhà phát triển hiểu rõ hơn về cách người chơi đang thưởng thức trò chơi của họ. Với ý nghĩ đó, chúng tôi hy vọng bạn không phiền khi chúng tôi hỏi: Bạn có thích Game Dev Tycoon cho đến nay không?"
		}, {
			"value": "Yes, love it!",
			"comment": "button",
			"translation": "Có, rất thích!"
		}, {
			"value": "Not really.",
			"comment": "button",
			"translation": "Không hẳn."
		}, {
			"value": "Thanks for letting us know! If you want to share some specific feedback with us or if you think we can assist you, please feel free to contact us at {0}",
			"translation": "Cảm ơn bạn đã cho chúng tôi biết! Nếu bạn muốn chia sẻ một số phản hồi cụ thể với chúng tôi hoặc nếu bạn nghĩ chúng tôi có thể hỗ trợ bạn, vui lòng liên hệ với chúng tôi tại {0}"
		}, {
			"value": "That's amazing! We are really happy to hear that you enjoy our little game! If you have the willpower to let go of running {0} for a moment, we would really appreciate if you could rate the game.",
			"comment": "{0} will be replaced by the player's ingame company name",
			"translation": "Thật tuyệt vời! Chúng tôi thực sự rất vui khi biết bạn thích trò chơi nhỏ của chúng tôi! Nếu bạn có đủ ý chí để tạm dừng điều hành {0} một chút, chúng tôi sẽ rất biết ơn nếu bạn có thể đánh giá trò chơi."
		}, {
			"value": "If you have the willpower to let go of running {0} for a moment, we would really appreciate if you could rate the game.",
			"comment": "{0} will be replaced by the player's ingame company name",
			"translation": "Nếu bạn có đủ ý chí để tạm dừng điều hành {0} một chút, chúng tôi sẽ rất biết ơn nếu bạn có thể đánh giá trò chơi."
		}, {
			"value": "Yes (rate now)",
			"comment": "button",
			"translation": "Có (đánh giá ngay)"
		}, {
			"value": "No, thanks.",
			"comment": "button",
			"translation": "Không, cảm ơn."
		}, {
			"value": "Thanks for taking the time to give our little game a rating.\nWe very much appreciate it!",
			"translation": "Cảm ơn bạn đã dành thời gian để đánh giá trò chơi nhỏ của chúng tôi.\nChúng tôi rất trân trọng điều đó!"
		}, {
			"value": "No worries! Happy gaming!",
			"translation": "Không sao cả! Chúc bạn chơi game vui vẻ!"
		}, {
			"value": "Sorry, I'm busy",
			"translation": "Xin lỗi, tôi bận"
		}, {
			"value": "Sorry, we are all busy",
			"translation": "Xin lỗi, chúng tôi đều bận"
		}, {
			"value": "Subscribe",
			"comment": "button. Context: User confirms to subscribe to an e-mail newsletter",
			"translation": "Đăng ký"
		}, {
			"value": "Greenheart Games Newsletter",
			"translation": "Bản tin Greenheart Games"
		}, {
			"value": "To visit the lab simply touch the screen and drag to the left. Alternatively, you can also click on the little R&D Lab information card at the bottom of the screen.",
			"translation": "Để đến phòng thí nghiệm, chỉ cần chạm vào màn hình và kéo sang trái. Ngoài ra, bạn cũng có thể nhấp vào thẻ thông tin Phòng R&D nhỏ ở cuối màn hình."
		}, {
			"value": "Your very own game console is now on the market. Game consoles are complex machines and when you sell a lot of them it is only natural that some of them need to be repaired.{n}While your console is on sale your hardware team will have to work off maintenance points. Depending on the quality of the console and how many you sell these points vary from week to week.{n}Try to give your hardware lab enough budget so that they stay on top of the maintenance, otherwise customers will become unhappy when they have to wait too long for their consoles to be repaired. You can see how well your team is doing in the console sales graph at the right side of the screen.",
			"translation": "Hệ máy chơi game của riêng bạn hiện đã có mặt trên thị trường. Máy chơi game là những cỗ máy phức tạp và khi bạn bán được nhiều, việc một số máy cần sửa chữa là điều tự nhiên.{n}Trong khi hệ máy của bạn đang được bán, đội ngũ phần cứng của bạn sẽ phải xử lý các điểm bảo trì. Tùy thuộc vào chất lượng của hệ máy và số lượng bạn bán được, các điểm này sẽ thay đổi theo tuần.{n}Hãy cố gắng cung cấp đủ ngân sách cho phòng thí nghiệm phần cứng của bạn để họ luôn kiểm soát được việc bảo trì, nếu không khách hàng sẽ không hài lòng khi phải chờ quá lâu để sửa chữa máy chơi game của họ. Bạn có thể xem đội ngũ của mình hoạt động tốt như thế nào trong biểu đồ doanh số bán máy chơi game ở phía bên phải màn hình."
		}, {
			"value": "Your local save game seems to be different from the one stored in the cloud. Which one would you like to load?",
			"translation": "Tệp lưu cục bộ của bạn có vẻ khác với tệp được lưu trữ trên đám mây. Bạn muốn tải tệp nào?"
		}, {
			"value": "Note: Once you save the game, the new save file will be stored both locally and on the cloud.",
			"translation": "Lưu ý: Sau khi bạn lưu trò chơi, tệp lưu mới sẽ được lưu trữ cả cục bộ và trên đám mây."
		}, {
			"value": "Now that your game is on sale you will receive the income from the game every week.\nYou can see how well your game is doing by looking at the sales graph at the right hand side of the screen.",
			"translation": "Bây giờ trò chơi của bạn đã được bán, bạn sẽ nhận được thu nhập từ trò chơi mỗi tuần.\nBạn có thể xem trò chơi của mình hoạt động tốt như thế nào bằng cách xem biểu đồ doanh số ở phía bên phải màn hình."
		}, {
			"value": "To visit the hardware lab simply touch the screen and drag to the right. Alternatively, you can also click on the little Hardware Lab information card at the bottom of the screen.",
			"translation": "Để đến phòng thí nghiệm phần cứng, chỉ cần chạm vào màn hình và kéo sang phải. Ngoài ra, bạn cũng có thể nhấp vào thẻ thông tin Phòng thí nghiệm Phần cứng nhỏ ở cuối màn hình."
		}, {
			"value": "Contract Work",
			"comment": "heading",
			"translation": "Công việc Hợp đồng"
		}, {
			"value": "Sales Record",
			"comment": "heading",
			"translation": "Kỷ lục Doanh thu"
		}, {
			"value": "Lab report",
			"comment": "heading",
			"translation": "Báo cáo Phòng thí nghiệm"
		}, {
			"value": "Game Review",
			"comment": "heading",
			"translation": "Đánh giá Game"
		}, {
			"value": "Sales Report",
			"comment": "heading",
			"translation": "Báo cáo Doanh thu"
		}, {
			"value": "First Game Release",
			"comment": "heading",
			"translation": "Phát hành Game đầu tiên"
		}, {
			"value": "First Fans",
			"comment": "heading",
			"translation": "Những người hâm mộ đầu tiên"
		}, {
			"value": "Patch Release",
			"comment": "heading",
			"translation": "Phát hành Bản vá"
		}, {
			"value": "Goal Hint",
			"comment": "heading",
			"translation": "Gợi ý Mục tiêu"
		}, {
			"value": "Engine Reminder",
			"comment": "heading",
			"translation": "Nhắc nhở về Engine"
		}, {
			"value": "Bad Sales",
			"comment": "heading",
			"translation": "Doanh thu Tệ"
		}, {
			"value": "New Opportunities",
			"comment": "heading",
			"translation": "Cơ hội Mới"
		}, {
			"value": "Industry News",
			"comment": "heading",
			"translation": "Tin tức Ngành"
		}, {
			"value": "Hardware lab",
			"comment": "heading",
			"translation": "Phòng thí nghiệm Phần cứng"
		}, {
			"value": "Coding Contest",
			"comment": "heading",
			"translation": "Cuộc thi Lập trình"
		}, {
			"value": "Developer Meetup",
			"comment": "heading",
			"translation": "Gặp gỡ Nhà phát triển"
		}, {
			"value": "Game Interview",
			"comment": "heading",
			"translation": "Phỏng vấn về Game"
		}, {
			"value": "Local News",
			"comment": "heading",
			"translation": "Tin tức Địa phương"
		}, {
			"value": "Industry Rumours",
			"comment": "heading",
			"translation": "Tin đồn trong Ngành"
		}, {
			"value": "Bailout",
			"comment": "heading",
			"translation": "Cứu trợ Tài chính"
		}, {
			"value": "G3 training",
			"comment": "heading",
			"translation": "Huấn luyện G3"
		}, {
			"value": "R&D lab",
			"comment": "heading",
			"translation": "Phòng R&D"
		}, {
			"value": "Security Upgrade",
			"comment": "heading",
			"translation": "Nâng cấp Bảo mật"
		}, {
			"value": "Investment",
			"comment": "heading",
			"translation": "Đầu tư"
		}, {
			"value": "Scam",
			"comment": "heading",
			"translation": "Lừa đảo"
		}, {
			"value": "Special Offer",
			"comment": "heading",
			"translation": "Ưu đãi Đặc biệt"
		}, {
			"value": "Police Investigation",
			"comment": "heading",
			"translation": "Điều tra của Cảnh sát"
		}, {
			"value": "Sponsorship Request",
			"comment": "heading",
			"translation": "Yêu cầu Tài trợ"
		}, {
			"value": "News Report",
			"comment": "heading",
			"translation": "Báo cáo Tin tức"
		}, {
			"value": "Piracy Alert",
			"comment": "heading",
			"translation": "Cảnh báo Vi phạm Bản quyền"
		}, {
			"value": "Illegal Fan Game",
			"comment": "heading",
			"translation": "Game Fan Hâm mộ Bất hợp pháp"
		}, {
			"value": "Theft",
			"comment": "heading",
			"translation": "Trộm cắp"
		}, {
			"value": "Solar Panels",
			"comment": "heading",
			"translation": "Tấm pin Năng lượng Mặt trời"
		}, {
			"value": "Office Upgrade",
			"comment": "heading",
			"translation": "Nâng cấp Văn phòng"
		}, {
			"value": "Departure Science",
			"comment": "heading",
			"translation": "Departure Science"
		}, {
			"value": "Console Announcement",
			"comment": "heading",
			"translation": "Công bố Console"
		}, {
			"value": "Engine Source Code",
			"comment": "heading",
			"translation": "Mã nguồn Engine"
		}, {
			"value": "Patent Troll",
			"comment": "heading",
			"translation": "Kẻ trục lợi bằng sáng chế"
		}, {
			"value": "Share Offer",
			"comment": "heading",
			"translation": "Đề nghị Mua Cổ phần"
		}, {
			"value": "Dividends",
			"comment": "heading",
			"translation": "Cổ tức"
		}, {
			"value": "Off (recommended)",
			"translation": "Tắt (khuyên dùng)"
		}, {
			"value": "Pirate Mode",
			"translation": "Chế độ Ăn cắp bản quyền"
		}, {
			"value": "The pirate mode causes severely reduced sales on all of your games. Bankruptcy is likely. You can develop copy protection but using it will upset fans. 'Fan mail' inspired by true events will reach your inbox from time to time.",
			"translation": "Chế độ ăn cắp bản quyền làm giảm nghiêm trọng doanh số bán hàng của tất cả các trò chơi của bạn. Khả năng phá sản là rất cao. Bạn có thể phát triển tính năng bảo vệ chống sao chép nhưng việc sử dụng nó sẽ khiến người hâm mộ khó chịu. Thỉnh thoảng, 'thư của người hâm mộ' lấy cảm hứng từ các sự kiện có thật sẽ được gửi đến hộp thư của bạn."
		}, {
			"value": "WE believe in your business portfolio and would like to aquire shares in {0}.\nWILL you consider this opportunity?\nOWN {1} in cash immediately, if you sign over 20% of your business.\n\nYOU can also take {2} in cash for 30% of your business.",
			"comment": "capitalized words should result in somethign similar to WE OWN YOU",
			"translation": "CHÚNG TÔI tin tưởng vào danh mục kinh doanh của bạn và muốn mua cổ phần của {0}.\nBẠN CÓ cân nhắc cơ hội này không?\nSỞ HỮU ngay {1} tiền mặt, nếu bạn chuyển nhượng 20% doanh nghiệp của mình.\n\nBẠN cũng có thể nhận {2} tiền mặt để đổi lấy 30% doanh nghiệp CỦA BẠN."
		}, {
			"value": "WE believe in your business portfolio and would like to aquire shares in {0} of which we already own {1}%.\nWILL you consider this opportunity?\nOWN {2} in cash immediately, if you sign over 20% of your business.\n\nYOU can also take {3} in cash for 30% of your business.",
			"comment": "capitalized words should result in somethign similar to WE OWN YOU",
			"translation": "CHÚNG TÔI tin tưởng vào danh mục kinh doanh của bạn và muốn mua thêm cổ phần của {0} mà chúng tôi đã sở hữu {1}%.\nBẠN CÓ cân nhắc cơ hội này không?\nSỞ HỮU ngay {2} tiền mặt, nếu bạn chuyển nhượng 20% doanh nghiệp của mình.\n\nBẠN cũng có thể nhận {3} tiền mặt để đổi lấy 30% doanh nghiệp CỦA BẠN."
		}, {
			"value": "Share offer",
			"comment": "heading",
			"translation": "Đề nghị Mua Cổ phần"
		}, {
			"value": "Sell 20% for {0}",
			"comment": "keep short",
			"translation": "Bán 20% lấy {0}"
		}, {
			"value": "Sell 30% for {0}",
			"comment": "keep short",
			"translation": "Bán 30% lấy {0}"
		}, {
			"value": "We are currently a {0}% share holder in {1}. We are willing to offer you a chance to buy back some shares.",
			"translation": "Chúng tôi hiện đang là cổ đông nắm giữ {0}% cổ phần của {1}. Chúng tôi sẵn sàng cho bạn cơ hội mua lại một số cổ phần."
		}, {
			"value": "Buy {0}% back for {1}",
			"comment": "keep short",
			"translation": "Mua lại {0}% với giá {1}"
		}, {
			"value": "Buy 30% back for {0}",
			"comment": "keep short",
			"translation": "Mua lại 30% với giá {0}"
		}, {
			"value": "Decline",
			"translation": "Từ chối"
		}, {
			"value": "Buy back {0}% for {1}",
			"comment": "keep short",
			"translation": "Mua lại {0}% với giá {1}"
		}, {
			"value": "Buy back 30% for {0}",
			"comment": "keep short",
			"translation": "Mua lại 30% với giá {0}"
		}, {
			"value": "DRM",
			"translation": "DRM"
		}, {
			"value": "Copy Protection V{0}",
			"translation": "Bảo vệ Chống Sao chép V{0}"
		}, {
			"value": "Statistical Anomaly",
			"translation": "Dị thường Thống kê"
		}, {
			"value": "Reach level 2 in pirate mode.",
			"comment": "achievement",
			"translation": "Đạt cấp 2 trong chế độ ăn cắp bản quyền."
		}, {
			"value": "Against all odds",
			"comment": "achievement title",
			"translation": "Vượt qua mọi khó khăn"
		}, {
			"value": "Beat all odds and finish the game in pirate mode.",
			"comment": "achievement",
			"translation": "Vượt qua mọi khó khăn và hoàn thành trò chơi ở chế độ ăn cắp bản quyền."
		}, {
			"value": "Hey {0},",
			"comment": "email greeting, where {0} is company name",
			"translation": "Này {0},"
		}, {
			"value": "Hi there,",
			"comment": "email greeting",
			"translation": "Chào bạn,"
		}, {
			"value": "Greetings,",
			"comment": "email greeting",
			"translation": "Xin chào,"
		}, {
			"value": "Dear developers,",
			"comment": "email greeting",
			"translation": "Kính gửi các nhà phát triển,"
		}, {
			"value": "Hello {0},",
			"comment": "email greeting, where {0} is CEO name",
			"translation": "Chào {0},"
		}, {
			"value": "I quite liked {0}",
			"comment": "{0} is game name, continues with piracy fragment 2",
			"translation": "Tôi khá thích {0}"
		}, {
			"value": "I really enjoyed your game {0}",
			"comment": "{0} is game name, continues with piracy fragment 2",
			"translation": "Tôi thực sự rất thích trò chơi {0} của bạn"
		}, {
			"value": "{0} is really interesting",
			"comment": "{0} is game name, continues with piracy fragment 2",
			"translation": "{0} thực sự rất thú vị"
		}, {
			"value": "{0} is awesome",
			"comment": "{0} is game name, continues with piracy fragment 2",
			"translation": "{0} thật tuyệt vời"
		}, {
			"value": "but I've played more interesting {0} games before",
			"comment": "piracy fragment 2 - continue with piracy fragment 3, {0} is genre name",
			"translation": "nhưng tôi đã chơi những trò chơi {0} thú vị hơn trước đây"
		}, {
			"value": "but other {0} are more innovative",
			"comment": "piracy fragment 2 - continue with piracy fragment 3, {0} is genre name",
			"translation": "nhưng những trò {0} khác thì sáng tạo hơn"
		}, {
			"value": "but I think it's not really AAA quality",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng tôi nghĩ nó không thực sự đạt chất lượng AAA"
		}, {
			"value": "but I've only played {0} hours of it",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng tôi mới chỉ chơi {0} giờ"
		}, {
			"value": "but I hated the ending",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng tôi ghét cái kết"
		}, {
			"value": "but it really needs more features",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng nó thực sự cần thêm nhiều tính năng"
		}, {
			"value": "but it needs more depth",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng nó cần có chiều sâu hơn"
		}, {
			"value": "but it could use more polish",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng nó có thể được trau chuốt thêm"
		}, {
			"value": "but it isn't AAA quality",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng nó không đạt chất lượng AAA"
		}, {
			"value": "but it's not as good as other games",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng nó không hay bằng những trò chơi khác"
		}, {
			"value": "but other games are better",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng những trò chơi khác hay hơn"
		}, {
			"value": "but I think it's too expensive",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng tôi nghĩ nó quá đắt"
		}, {
			"value": "but I think it needs to be at least 30% cheaper",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng tôi nghĩ nó cần phải rẻ hơn ít nhất 30%"
		}, {
			"value": "but I'm saving up for this new graphics card",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng tôi đang tiết kiệm tiền để mua card đồ họa mới này"
		}, {
			"value": "but I don't like you",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng tôi không thích bạn"
		}, {
			"value": "but I don't like that {0} works for you",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng tôi không thích {0} làm việc cho bạn"
		}, {
			"value": "but I think parts of it should work differently",
			"comment": "piracy fragment 2 - continue with piracy fragment 3",
			"translation": "nhưng tôi nghĩ một số phần của nó nên hoạt động khác đi"
		}, {
			"value": "so I stole it.",
			"comment": "piracy fragment 3",
			"translation": "nên tôi đã ăn cắp nó."
		}, {
			"value": "so I pirated it.",
			"comment": "piracy fragment 3",
			"translation": "nên tôi đã tải lậu nó."
		}, {
			"value": "so I downloaded your game from a gamez website.",
			"comment": "piracy fragment 3",
			"translation": "nên tôi đã tải trò chơi của bạn từ một trang web gamez."
		}, {
			"value": "so I used a torrent.",
			"comment": "piracy fragment 3",
			"translation": "nên tôi đã dùng torrent."
		}, {
			"value": "so I didn't want to buy it.",
			"comment": "piracy fragment 3",
			"translation": "nên tôi không muốn mua nó."
		}, {
			"value": "so I think you don't deserve my money.",
			"comment": "piracy fragment 3",
			"translation": "nên tôi nghĩ bạn không xứng đáng với tiền của tôi."
		}, {
			"value": "Anyway, just make better games, okay?",
			"translation": "Dù sao thì, cứ làm game hay hơn đi, được chứ?"
		}, {
			"value": "Anyway, you really should release more updates for it.",
			"translation": "Dù sao thì, bạn thực sự nên phát hành thêm nhiều bản cập nhật cho nó."
		}, {
			"value": "Looking forward to the sequel.",
			"translation": "Mong chờ phần tiếp theo."
		}, {
			"value": "You should give the game away for free.",
			"translation": "Bạn nên cho trò chơi này miễn phí đi."
		}, {
			"value": "But hey, I've told my friends of the game so that's free publicity for you!",
			"translation": "Nhưng này, tôi đã kể cho bạn bè về trò chơi này rồi, coi như quảng cáo miễn phí cho bạn đấy!"
		}, {
			"value": "- Sent from my grPhone.",
			"translation": "- Gửi từ grPhone của tôi."
		}, {
			"value": "PS: I want to work in the games industry. Do you have a job for me?",
			"translation": "Tái bút: Tôi muốn làm việc trong ngành công nghiệp game. Bạn có việc gì cho tôi không?"
		}, {
			"value": "Mail",
			"comment": "header",
			"translation": "Thư"
		}, {
			"value": "but your use of copy protection makes the game really slow.",
			"comment": "piracy fragment",
			"translation": "nhưng việc bạn sử dụng tính năng bảo vệ chống sao chép khiến trò chơi rất chậm."
		}, {
			"value": "but the included copy protection software is really inconvenient.",
			"comment": "piracy fragment",
			"translation": "nhưng phần mềm bảo vệ chống sao chép đi kèm thực sự rất bất tiện."
		}, {
			"value": "but the game stopped working saying that it wasn't a genuine copy! I swear I bought it and I'm very unhappy about this.",
			"comment": "piracy fragment",
			"translation": "nhưng trò chơi ngừng hoạt động và báo rằng đó không phải là bản chính hãng! Tôi thề là tôi đã mua nó và tôi rất không vui về điều này."
		}, {
			"value": "but the copy protection in that game constantly crashes my system.",
			"comment": "piracy fragment",
			"translation": "nhưng tính năng bảo vệ chống sao chép trong trò chơi đó liên tục làm treo hệ thống của tôi."
		}, {
			"value": "but I hate how inconvenient the copy protection is.",
			"comment": "piracy fragment",
			"translation": "nhưng tôi ghét sự bất tiện của tính năng bảo vệ chống sao chép."
		}, {
			"value": "Can you please not use it in the future?",
			"translation": "Làm ơn đừng sử dụng nó trong tương lai được không?"
		}, {
			"value": "A friend of mine pirated the game and he doesn't have any issues! This isn't fair!",
			"translation": "Một người bạn của tôi đã tải lậu trò chơi và anh ấy không gặp vấn đề gì cả! Điều này thật không công bằng!"
		}, {
			"value": "Thanks for your understanding.",
			"translation": "Cảm ơn sự thông cảm của bạn."
		}, {
			"value": "Please don't punish your fans for piracy!",
			"translation": "Làm ơn đừng trừng phạt người hâm mộ của bạn vì vi phạm bản quyền!"
		}, {
			"value": "I will never buy anything from your company again!",
			"translation": "Tôi sẽ không bao giờ mua bất cứ thứ gì từ công ty của bạn nữa!"
		}, {
			"value": "I will make sure to warn all of my friends about this.",
			"translation": "Tôi chắc chắn sẽ cảnh báo tất cả bạn bè của mình về điều này."
		}, {
			"value": "Others",
			"translation": "Khác"
		}, {
			"value": "To stay afloat in pirate mode you can sell part of your company to a third party to receive a much needed cash boost. Be mindful, however, that shareholders will automatically receive small dividend payments any time you make a profit from game sales.{n}These dividends grow larger the more shares you have sold and while they may seem insignificant, they can add up to a lot of lost profit over time.{n}You will be given the option to buy back shares regularly but share holders only offer buy-back options for a hefty profit.",
			"translation": "Để duy trì hoạt động trong chế độ ăn cắp bản quyền, bạn có thể bán một phần công ty của mình cho bên thứ ba để nhận được một khoản tiền mặt cần thiết. Tuy nhiên, hãy lưu ý rằng các cổ đông sẽ tự động nhận được các khoản thanh toán cổ tức nhỏ mỗi khi bạn thu được lợi nhuận từ việc bán game.{n}Những khoản cổ tức này sẽ tăng lên khi bạn bán nhiều cổ phần hơn và mặc dù chúng có vẻ không đáng kể, nhưng theo thời gian, chúng có thể cộng lại thành một khoản lợi nhuận bị mất rất lớn.{n}Bạn sẽ được trao cơ hội mua lại cổ phần thường xuyên nhưng các cổ đông chỉ đưa ra các lựa chọn mua lại với lợi nhuận khổng lồ."
		}, {
			"value": "Your game sales are severely reduced in pirate mode and survival is unlikely. Once you are able to create your own engines you can counteract the effects of piracy by researching copy protection and integrating it in your games.{n}While copy protection decreases the effect of piracy on sales, it will also upset some of your fans. Making matters worse, copy protection is fast moving technology and if you don't stay up to date with new innovations, it will become less effective over time.{n}You can see the effects of piracy and the state of your copy protection through your game reports.",
			"translation": "Doanh số bán game của bạn bị giảm nghiêm trọng trong chế độ ăn cắp bản quyền và khả năng tồn tại là rất thấp. Một khi bạn có thể tạo ra các engine của riêng mình, bạn có thể chống lại tác động của vi phạm bản quyền bằng cách nghiên cứu tính năng bảo vệ chống sao chép và tích hợp nó vào trò chơi của bạn.{n}Mặc dù bảo vệ chống sao chép làm giảm tác động của vi phạm bản quyền đối với doanh số bán hàng, nó cũng sẽ khiến một số người hâm mộ của bạn khó chịu. Tệ hơn nữa, bảo vệ chống sao chép là công nghệ phát triển nhanh và nếu bạn không cập nhật những đổi mới, nó sẽ trở nên kém hiệu quả theo thời gian.{n}Bạn có thể xem tác động của vi phạm bản quyền và trạng thái bảo vệ chống sao chép của mình thông qua các báo cáo trò chơi."
		}, {
			"value": "Cooking",
			"comment": "game topic",
			"translation": "Nấu ăn"
		}, {
			"value": "Farming",
			"comment": "game topic",
			"translation": "Nông trại"
		}, {
			"value": "Crime",
			"comment": "game topic",
			"translation": "Tội phạm"
		}, {
			"value": "Disasters",
			"comment": "game topic",
			"translation": "Thảm họa"
		}, {
			"value": "Assassin",
			"comment": "game topic",
			"translation": "Sát thủ"
		}, {
			"value": "Thief",
			"comment": "game topic",
			"translation": "Trộm cắp"
		}, {
			"value": "Colonization",
			"comment": "game topic",
			"translation": "Thuộc địa hóa"
		}, {
			"value": "Construction",
			"comment": "game topic",
			"translation": "Xây dựng"
		}, {
			"value": "Mythology",
			"comment": "game topic",
			"translation": "Thần thoại"
		}, {
			"value": "Abstract",
			"comment": "game topic",
			"translation": "Trừu tượng"
		}, {
			"value": "Mad Science",
			"comment": "game topic",
			"translation": "Khoa học Điên rồ"
		}, {
			"value": "Extreme Sports",
			"comment": "game topic",
			"translation": "Thể thao Cực đoan"
		}, {
			"value": "Dystopian",
			"comment": "game topic",
			"translation": "Phản địa đàng"
		}, {
			"value": "Expedition",
			"comment": "game topic",
			"translation": "Thám hiểm"
		}, {
			"value": "Technology",
			"comment": "game topic",
			"translation": "Công nghệ"
		}, {
			"value": "Ninvento has today revealed their upcoming game console: The Ninvento Swap. The device seems to function both as a portable console and as a home console. When the Swap is removed from its docking station, unique controller pads called 'Fun-Pads' are attached to the side of the screen and turn the console into a handheld device.{n}The reaction to the announcement was mixed as many voiced concerns that the device might not have a clear audience and might fail to appeal to both casual and core gamers. Others praised the unique nature of the device and pointed out that Ninvento has frequently managed to land successes with odd devices in the past. The Swap is said to hit markets {0}.",
			"comment": "{0} is date referral sentence fragment",
			"translation": "Hôm nay, Ninvento đã tiết lộ hệ máy chơi game sắp ra mắt của họ: The Ninvento Swap. Thiết bị này dường như hoạt động như cả một hệ máy di động và một hệ máy gia đình. Khi Swap được tháo khỏi đế cắm, các tay cầm điều khiển độc đáo được gọi là 'Fun-Pads' sẽ được gắn vào cạnh màn hình và biến hệ máy thành một thiết bị cầm tay.{n}Phản ứng đối với thông báo này khá trái chiều khi nhiều người bày tỏ lo ngại rằng thiết bị có thể không có đối tượng rõ ràng và có thể không thu hút được cả người chơi thông thường lẫn người chơi chuyên nghiệp. Những người khác ca ngợi tính chất độc đáo của thiết bị và chỉ ra rằng Ninvento thường xuyên đạt được thành công với các thiết bị kỳ lạ trong quá khứ. Swap được cho là sẽ có mặt trên thị trường {0}."
		}, {
			"value": "The recently released Ninvento Swap console has caused an unusual social media storm. It all started when a consumer licked one of the game cartridges and reported that it tasted extremely bad. Thousands of consumers then repeated the experiment, tasting their cartridges and reporting the result on social media, further encouraging others to do the same.{n}Ninvento has now published an official statement to confirm that game cartridges for the Swap are coated with denatonium benzoate, a non-toxic bittering agent. This was apparently done to discourage children from biting on and swallowing the fairly small cartridges.{n}Initial reactions to the console itself have been more positive than to the taste of its cartridges as the Swap is turning out to be quite popular with gamers around the globe.",
			"translation": "Hệ máy Ninvento Swap mới ra mắt gần đây đã gây ra một cơn bão truyền thông xã hội bất thường. Mọi chuyện bắt đầu khi một người tiêu dùng liếm một trong những băng game và báo cáo rằng nó có vị cực kỳ tệ. Hàng ngàn người tiêu dùng sau đó đã lặp lại thử nghiệm, nếm thử băng game của họ và báo cáo kết quả trên mạng xã hội, tiếp tục khuyến khích những người khác làm điều tương tự.{n}Ninvento hiện đã đưa ra một tuyên bố chính thức để xác nhận rằng các băng game cho Swap được phủ một lớp denatonium benzoate, một chất làm đắng không độc hại. Điều này rõ ràng được thực hiện để ngăn trẻ em cắn và nuốt những chiếc băng game khá nhỏ.{n}Phản ứng ban đầu đối với chính hệ máy này tích cực hơn so với vị của băng game của nó vì Swap đang tỏ ra khá phổ biến với các game thủ trên toàn cầu."
		}, {
			"value": "Approximately {0}% of players pirated {1}.",
			"comment": "{0} is a number, {1} is game title",
			"translation": "Khoảng {0}% người chơi đã sao chép lậu {1}."
		}, {
			"value": "The effectiveness of our copy protection technology was {0}.",
			"translation": "Hiệu quả của công nghệ bảo vệ chống sao chép của chúng tôi là {0}."
		}, {
			"value": "acceptable",
			"translation": "chấp nhận được"
		}, {
			"value": "excellent",
			"translation": "xuất sắc"
		}, {
			"value": "inadequate",
			"translation": "không đủ"
		}, {
			"value": "Share Offers",
			"comment": "heading",
			"translation": "Đề nghị Mua Cổ phần"
		}, {
			"value": "Sales Reports",
			"translation": "Báo cáo Doanh thu"
		}, {
			"value": "Auto-Popup",
			"translation": "Tự động Hiện lên"
		}, {
			"value": "Message Queue",
			"translation": "Hàng đợi Tin nhắn"
		}, {
			"value": "Upload",
			"comment": "menu item",
			"translation": "Tải lên"
		}, {
			"value": "Download",
			"comment": "menu item",
			"translation": "Tải xuống"
		}, {
			"value": "Delete",
			"comment": "menu item",
			"translation": "Xóa"
		}, {
			"value": "Do you really want to delete this save slot?",
			"translation": "Bạn có thực sự muốn xóa ô lưu này không?"
		}, {
			"value": "Upload your game to our servers and receive a short save-code which you can then use to continue playing on a different device.",
			"translation": "Tải trò chơi của bạn lên máy chủ của chúng tôi và nhận một mã lưu ngắn mà bạn có thể sử dụng để tiếp tục chơi trên một thiết bị khác."
		}, {
			"value": "Hooray! The servers have generated this beautiful save-code for you.",
			"translation": "Tuyệt vời! Máy chủ đã tạo ra một mã lưu đẹp đẽ này cho bạn."
		}, {
			"value": "The save-code was copied to your clipboard.",
			"translation": "Mã lưu đã được sao chép vào bộ nhớ tạm của bạn."
		}, {
			"value": "Please copy the save-code to your clipboard.",
			"translation": "Vui lòng sao chép mã lưu vào bộ nhớ tạm của bạn."
		}, {
			"value": "Enter a save-code to download the corresponding game into the selected save slot.",
			"translation": "Nhập mã lưu để tải xuống trò chơi tương ứng vào ô lưu đã chọn."
		}, {
			"value": "I agree to the {0}",
			"comment": "{0} refers to the Game Data Policy link",
			"translation": "Tôi đồng ý với {0}"
		}, {
			"value": "Existing",
			"comment": "description above an old save game that the user may overwrite",
			"translation": "Hiện có"
		}, {
			"value": "Replace and load game",
			"comment": "confirmation button",
			"translation": "Thay thế và tải game"
		}, {
			"value": "Enable achievements on this save.",
			"translation": "Kích hoạt thành tích trên bản lưu này."
		}, {
			"value": "Invalid Savegame",
			"comment": "error message in a popup dialogue",
			"translation": "Bản lưu không hợp lệ"
		}, {
			"value": "Network Error",
			"comment": "error message in a popup dialogue",
			"translation": "Lỗi Mạng"
		}, {
			"value": "Unable to authenticate your Nintendo Account.",
			"translation": "Không thể xác thực Tài khoản Nintendo của bạn."
		}, {
			"value": "Unable to authenticate your Nintendo Account. Please try again.",
			"translation": "Không thể xác thực Tài khoản Nintendo của bạn. Vui lòng thử lại."
		}]
	};
})();