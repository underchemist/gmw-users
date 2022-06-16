import React from 'react'
import { Menu, MenuItem, Stack } from '@mui/material'
import { ButtonPrimary } from '../../styles/buttons'
import language from '../../language'
import { ArrowDropDown } from '@mui/icons-material'

const AddMonitoringSectionMenu = () => {
  const [anchorElement, setMenuanchorElementement] = React.useState(null)
  const isMenuOpen = Boolean(anchorElement)
  const handleMenuButtonClick = (event) => {
    setMenuanchorElementement(event.currentTarget)
  }
  const handleMenuClose = () => {
    setMenuanchorElementement(null)
  }

  return (
    <Stack>
      <ButtonPrimary
        id='add-monitoring-section-button'
        aria-controls={isMenuOpen ? 'add-monitoring-section-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={isMenuOpen ? 'true' : undefined}
        onClick={handleMenuButtonClick}>
        {language.pages.siteQuestionsOverview.addMonitoringSectionButton}
        <ArrowDropDown />
      </ButtonPrimary>

      <Menu
        id='add-monitoring-section-menu'
        anchorElement={anchorElement}
        open={isMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'add-monitoring-section-button'
        }}>
        <MenuItem>{language.pages.siteQuestionsOverview.formName.managementStatus}</MenuItem>
        <MenuItem>
          {language.pages.siteQuestionsOverview.formName.socioeconomicGovernanceStatusOutcomes}
        </MenuItem>
        <MenuItem>
          {language.pages.siteQuestionsOverview.formName.ecologicalStatusOutcomes}
        </MenuItem>
      </Menu>
    </Stack>
  )
}

AddMonitoringSectionMenu.propTypes = {}

export default AddMonitoringSectionMenu
