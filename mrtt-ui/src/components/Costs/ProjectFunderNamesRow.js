import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MenuItem, TextField } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'
import { costs as questions } from '../../data/questions'

const ProjectFunderNamesRow = ({ label, rowValue1, rowValue2, index, deleteItem, updateItem }) => {
  const [initialVal1, setInitialVal1] = useState('')
  const [currentVal1, setCurrentVal1] = useState('')
  const [initialVal2, setInitialVal2] = useState('')
  const [currentVal2, setCurrentVal2] = useState('')

  const handleDelete = () => {
    deleteItem(index)
  }

  const handleUpdate = () => {
    if (currentVal1 !== initialVal1 || currentVal2 !== initialVal2) {
      updateItem(index, currentVal1, currentVal2)
    }
  }

  const _setFormValues = useEffect(() => {
    if (rowValue1) {
      setCurrentVal1(rowValue1)
      setInitialVal1(rowValue1)
    }
    if (rowValue2) {
      setCurrentVal2(rowValue2)
      setInitialVal2(rowValue2)
    }
  }, [rowValue1, rowValue2])

  return (
    <TabularInputSection>
      <TabularLabel>{label}</TabularLabel>
      <TabularBox>
        <TextField
          select
          value={currentVal1}
          label='type'
          onBlur={handleUpdate}
          sx={{ width: '12.9em' }}
          onChange={(e) => setCurrentVal1(e.target.value)}>
          {questions.projectFunderNames.options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          sx={{ maxWidth: '7em', marginLeft: '0.5em' }}
          value={currentVal2}
          required
          label='percentage'
          onBlur={handleUpdate}
          inputProps={{ maxLength: 3 }}
          onChange={(e) => setCurrentVal2(e.target.value)}></TextField>
        <Delete onClick={handleDelete} sx={{ marginLeft: '0.5em' }}></Delete>
      </TabularBox>
    </TabularInputSection>
  )
}

ProjectFunderNamesRow.propTypes = {
  label: PropTypes.string.isRequired,
  rowValue1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowValue2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export const TabularBox = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export default ProjectFunderNamesRow
