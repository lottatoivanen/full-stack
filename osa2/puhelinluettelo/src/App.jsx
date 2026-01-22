import { useEffect, useState } from 'react'
import noteService from './services/notes'
import Notification from './components/Notification'
import './index.css'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, removePerson }) => (
  <div>
    {persons.map(person => (
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => removePerson(person.id)}>delete</button>
      </p>
    ))}
  </div>
)

export { Filter, PersonForm, Persons }

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
 
  useEffect(() => {
    noteService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const showNotification = (message, type = 'accepted') => {
    setNotification({message, type})
    setTimeout(() => {
      setNotification(null)
    }, 3000)   
  }

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName, number: newNumber,
    }
    const personExists = persons.some(person => person.name === newName)
    if (personExists) {
      const acceptUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (acceptUpdate) {
        const personToUpdate = persons.find(p => p.name === newName)
        const updatedPerson = { ...personToUpdate, number: newNumber }
        noteService
          .update(personToUpdate.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== personToUpdate.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            showNotification(`Updated ${newName}`, 'accepted')
          })
          .catch(() => {
            showNotification(`Information of ${newName} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.name !== newName))
          })
      }
      return
    }

    noteService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${newName}`, 'accepted')
      })
      .catch(() => {
        showNotification(`Information of ${newName} has already been removed from server`, 'error')
        setPersons(persons.filter(p => p.name !== newName))
      })

  }

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (!person) return

    if (window.confirm(`Delete ${person.name} ?`)) {
      noteService
        .remove(id)
        .then(() => {
          setPersons(prev => prev.filter(p => p.id !== id))
          showNotification(`Deleted ${person.name}`, 'accepted')
        })
        .catch(() => {
          showNotification(`Information of ${person.name} has already been removed from server`, 'error')
          setPersons(prev => prev.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Notification notification={notification} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons 
      persons={personsToShow}
      removePerson={removePerson} />
    </div>
  )

}

export default App