import { useState } from 'react'

const StatisticsLine = (props) => {
  const { text, value } = props
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const { good, neutral, bad } = props
  const all = good + neutral + bad
  if (all === 0) {
    console.log("statistics: No feedback given")
    return (
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  }
  const average = (good - bad) / all
  const positive = (good / all) * 100

  const stats = [
    { text: 'good', value: good },
    { text: 'neutral', value: neutral },
    { text: 'bad', value: bad },
    { text: 'all', value: all },
    { text: 'average', value: average },
    { text: 'positive', value: `${positive} %` },
  ]

  console.log("statistics", stats)

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          {stats.map(stat => (
            <StatisticsLine
              key={stat.text}
              text={stat.text}
              value={stat.value}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
