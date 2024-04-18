const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

// body-parser 미들웨어 설정
// app.use(bodyParser.urlencoded({ extended: true }))

// 정적 파일 제공
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/signup', express.static(path.join(__dirname, 'public/signup')))

app.use('/users', express.static(path.join(__dirname, 'public/users')))

// 루트 경로 => index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

// app.post('/users', async (req, res) => {

// })

// 회원가입 폼 제출 처리
app.post('/signup', async (req, res) => {
    const { name, university, major, studentNum, phoneNum, gender, enroll } = req.body

    try {
        await client.connect()
        const db = client.db('mydatabase') // 데이터베이스 선택
        const collection = db.collection('users') // 컬렉션 선택

        // 회원가입 정보 저장
        await collection.insertOne({
            name,
            university,
            major,
            studentNum,
            phoneNum,
            gender,
            enroll,
        })

        // 사용자가 입력한 정보 콘솔에 출력
        console.log('지원서')
        console.log('이름:', name)
        console.log('학교:', university)
        console.log('학과:', major)
        console.log('학번:', studentNum)
        console.log('전화번호:', phoneNum)
        console.log('성별:', gender)
        console.log('재학 여부:', enroll)

        // 회원가입 완료 페이지로 리다이렉션
        res.redirect('/signup-success')
    } catch (error) {
        console.error('회원가입 정보 저장 중 오류:', error)
        res.status(500).send('회원가입 정보를 저장하는 중 오류가 발생했습니다.')
    } finally {
        await client.close() // MongoDB 연결 종료
    }
})

// 회원가입 완료 페이지
app.get('/signup-success', (req, res) => {
    res.send('지원서 작성이 완료되었습니다!')
})

// 서버 시작
const port = 3000
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`)
})
