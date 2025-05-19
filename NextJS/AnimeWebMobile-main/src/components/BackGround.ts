const backGroundData = {
    backgrounds: [
        // Thêm các phần tử từ 1 đến 15
        ...Array.from({ length: 4 }, (_, i) => ({
            url: `/live2d/background/${i + 1}.jpg`
        }))
    ]
}

export default backGroundData;