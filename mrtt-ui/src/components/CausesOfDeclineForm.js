import { toast } from 'react-toastify'
import { useState, useCallback } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import {
  Box,
  Checkbox,
  FormControlLabel,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormPageHeader, StickyFormLabel } from '../styles/forms'
import * as yup from 'yup'

import { Form, FormQuestionDiv, SectionFormTitle, SubTitle, SubTitle2 } from '../styles/forms'
import { ButtonSubmit } from '../styles/buttons'
import { causesOfDecline } from '../data/questions'
import { causesOfDeclineOptions } from '../data/causesOfDeclineOptions'
import { ErrorText, Link } from '../styles/typography'
import { mapDataForApi } from '../library/mapDataForApi'
import { questionMapping } from '../data/questionMapping'
import language from '../language'
import LoadingIndicator from './LoadingIndicator'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import { ContentWrapper } from '../styles/containers'

function CausesOfDeclineForm() {
  const validationSchema = yup.object().shape({
    lossKnown: yup.string(),
    causesOfDecline: yup
      .array()
      .of(
        yup.object().shape({
          mainCauseLabel: yup.string(),
          mainCauseAnswers: yup.array().of(
            yup.object().shape({
              mainCauseAnswer: yup.string(),
              levelOfDegredation: yup.string().required()
            })
          ),
          subCauses: yup.array().of(
            yup.object().shape({
              subCauseLabel: yup.string(),
              subCauseAnswers: yup.array().of(
                yup.object().shape({
                  subCauseAnswer: yup.string(),
                  levelOfDegredation: yup.string().required()
                })
              )
            })
          )
        })
      )
      .min(1)
      .required('Select at least one cause of decline')
      .default([])
  })

  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { control, formState, watch, handleSubmit, reset: resetForm } = useForm(formOptions)
  const { errors } = formState
  const {
    fields: causesOfDeclineFields,
    append: causesOfDeclineAppend,
    remove: causesOfDeclineRemove,
    update: causesOfDeclineUpdate
  } = useFieldArray({ name: 'causesOfDecline', control })
  const lossKnownWatcher = watch('lossKnown')

  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [causesOfDeclineTypesChecked, causesOfDeclisetCausesOfDeclineTypesCheckedneTypesChecked] =
    useState([])
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`

  const setInitialCausesOfDeclineTypesFromServerData = useCallback((serverResponse) => {
    // get answers for 4.2 if they exist
    const initialCausesOfDecline =
      serverResponse?.data.find((dataItem) => dataItem.question_id === '4.2')?.answer_value ?? []

    const initialCausesOfDeclineTypesChecked = []

    // function that adds `${cause}-${causeAnswer}` to initialCausesOfDeclineTypes array, to simplify
    // isChecked lookups (as opposed to searching through deeply nested values every time)
    initialCausesOfDecline?.forEach((cause) => {
      // map types for mainCause options
      if (cause.mainCauseAnswers) {
        const mainCauseAnswers = cause.mainCauseAnswers?.map((answer) => answer.mainCauseAnswer)
        const label = cause.mainCauseLabel
        // adding maincause label appended to answer to avoid situations
        // where we have the same answers for different causes
        mainCauseAnswers.forEach((answer) =>
          initialCausesOfDeclineTypesChecked.push(`${label}-${answer}`)
        )
      }
      // map types for subCase options
      else {
        // adding subcase label appended to subcase answer since
        // there are subcauses that have some of the same answers (ex: 'other')
        cause.subCauses?.map((subCause) => {
          const label = subCause.subCauseLabel
          const answers = subCause.subCauseAnswers
          answers.forEach((answer) => {
            initialCausesOfDeclineTypesChecked.push(`${label}-${answer.subCauseAnswer}`)
          })
        })
      }
    })
    causesOfDeclisetCausesOfDeclineTypesCheckedneTypesChecked(initialCausesOfDeclineTypesChecked)
  }, [])

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.causesOfDecline,
    resetForm,
    setIsLoading,
    successCallback: setInitialCausesOfDeclineTypesFromServerData
  })

  // big function with many different cases for Q4.2 due to the nesting involved in this question type
  const handleCausesOfDeclineOnChange = ({
    event,
    mainCauseLabel,
    subCauseLabel,
    childOption,
    secondaryChildOption
  }) => {
    const mainCauseIndex = causesOfDeclineFields.findIndex(
      (cause) => cause.mainCauseLabel === mainCauseLabel
    )
    const currentMainCause = causesOfDeclineFields[mainCauseIndex]
    const subCauseIndex = currentMainCause?.subCauses?.findIndex(
      (subCause) => subCause.subCauseLabel === subCauseLabel
    )
    const currentSubCause = currentMainCause?.subCauses?.[subCauseIndex]
    const causesOfDeclineTypesCheckedCopy = causesOfDeclineTypesChecked

    //  case: checked, no subCause, and mainCause does not exist
    if (event.target.checked && !subCauseLabel && mainCauseIndex === -1) {
      causesOfDeclineAppend({
        mainCauseLabel,
        mainCauseAnswers: [{ mainCauseAnswer: childOption, levelOfDegredation: '' }]
      })
      causesOfDeclineTypesCheckedCopy.push(`${mainCauseLabel}-${childOption}`)
    }
    // case: checked, no subCause, mainCause exists
    else if (event.target.checked && !subCauseLabel && mainCauseIndex > -1) {
      currentMainCause.mainCauseAnswers.push({
        mainCauseAnswer: childOption,
        levelOfDegredation: ''
      })
      causesOfDeclineUpdate(currentMainCause)
      causesOfDeclineTypesCheckedCopy.push(`${mainCauseLabel}-${childOption}`)
    }
    // case: checked, subCause, mainCause does not exist
    else if (event.target.checked && subCauseLabel && mainCauseIndex === -1) {
      causesOfDeclineAppend({
        mainCauseLabel,
        subCauses: [
          {
            subCauseLabel,
            subCauseAnswers: [{ subCauseAnswer: secondaryChildOption, levelOfDegredation: '' }]
          }
        ]
      })
      causesOfDeclineTypesCheckedCopy.push(`${subCauseLabel}-${secondaryChildOption}`)
    }
    // case: checked, subCause, mainCause does exist
    else if (event.target.checked && subCauseLabel && mainCauseIndex > -1) {
      // if subCause does not exist within main cause
      if (subCauseIndex === -1) {
        currentMainCause.subCauses.push({
          subCauseLabel,
          subCauseAnswers: [{ subCauseAnswer: secondaryChildOption, levelOfDegredation: '' }]
        })
        causesOfDeclineUpdate(currentMainCause)
      }
      // if subCause does exist within main cause
      else {
        currentSubCause.subCauseAnswers.push({
          subCauseAnswer: secondaryChildOption,
          levelOfDegredation: ''
        })
        causesOfDeclineUpdate(currentMainCause)
      }
      causesOfDeclineTypesCheckedCopy.push(`${subCauseLabel}-${secondaryChildOption}`)
    }
    // case: unchecked, no subCause
    else if (!event.target.checked && !subCauseLabel) {
      // if only one answer exists within mainCauseAnswers
      if (currentMainCause.mainCauseAnswers.length === 1) {
        causesOfDeclineRemove(mainCauseIndex)
      }
      // if more than one answer exists within mainCauseAnwers
      else {
        const childOptionIndex = currentMainCause.mainCauseAnswers.findIndex(
          (option) => option.mainCauseAnswer === childOption
        )
        currentMainCause.mainCauseAnswers.splice(childOptionIndex, 1)
        causesOfDeclineUpdate(currentMainCause)
      }
      const typeIndex = causesOfDeclineTypesCheckedCopy.findIndex(
        (type) => type === `${mainCauseLabel}-${childOption}`
      )
      causesOfDeclineTypesCheckedCopy.splice(typeIndex, 1)
    }
    // case: unchecked, subCause exists
    else if (!event.target.checked && subCauseLabel) {
      // if only one answer exists within subCauseAnswers
      if (currentSubCause.subCauseAnswers.length === 1) {
        currentMainCause.subCauses.splice(subCauseIndex, 1)
        causesOfDeclineUpdate(currentMainCause)
      }
      // if more than one answer exists with subCauseAnswers
      else {
        const secondaryChildOptionIndex = currentSubCause.subCauseAnswers.findIndex(
          (option) => option.subCauseAnswer === secondaryChildOption
        )
        currentSubCause.subCauseAnswers.splice(secondaryChildOptionIndex, 1)
        causesOfDeclineUpdate(currentMainCause)
      }
      // remove main cause if subcauses array is empty
      if (currentMainCause.subCauses.length === 0) {
        causesOfDeclineRemove(mainCauseIndex)
      }
      const typeIndex = causesOfDeclineTypesCheckedCopy.findIndex(
        (type) => type === `${subCauseLabel}-${secondaryChildOption}`
      )
      causesOfDeclineTypesCheckedCopy.splice(typeIndex, 1)
    }
    causesOfDeclisetCausesOfDeclineTypesCheckedneTypesChecked(causesOfDeclineTypesCheckedCopy)
  }

  const onSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)

    if (!data) return
    'data', data

    axios
      .patch(apiAnswersUrl, mapDataForApi('causesOfDecline', data))
      .then(() => {
        setisSubmitting(false)
        toast.success(language.success.submit)
      })
      .catch(() => {
        setIsError(true)
        setisSubmitting(false)
        toast.error(language.error.apiLoad)
      })
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <SectionFormTitle>Causes of Decline</SectionFormTitle>
        <Link to={-1}>&larr; {language.form.navigateBackToSiteOverview}</Link>
      </FormPageHeader>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormQuestionDiv>
          <StickyFormLabel>{causesOfDecline.lossKnown.question}</StickyFormLabel>
          <Controller
            name='lossKnown'
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby='demo-radio-buttons-group-label'
                name='radio-buttons-group'>
                {/* Mui converts values to strings, even for booleans */}
                <FormControlLabel value={'true'} control={<Radio />} label='Yes' />
                <FormControlLabel value={'false'} control={<Radio />} label='No' />
              </RadioGroup>
            )}
          />
        </FormQuestionDiv>
        {lossKnownWatcher === 'true' ? (
          <FormQuestionDiv>
            <StickyFormLabel>{causesOfDecline.causesOfDecline.question}</StickyFormLabel>
            {causesOfDeclineOptions.map((mainCause, mainCauseIndex) => {
              return (
                <Box key={mainCauseIndex} sx={{ marginTop: '0.75em', marginBottom: '1.5em' }}>
                  <SubTitle variant='subtitle1'>{mainCause.label}</SubTitle>
                  {typeof mainCause.children[0] === 'string'
                    ? mainCause.children.map((childOption, childIndex) => (
                        <Box key={childIndex}>
                          <Box>
                            <ListItem>
                              <Checkbox
                                value={childOption}
                                checked={causesOfDeclineTypesChecked.includes(
                                  `${mainCause.label}-${childOption}`
                                )}
                                onChange={(event) =>
                                  handleCausesOfDeclineOnChange({
                                    event,
                                    mainCauseLabel: mainCause.label,
                                    childOption
                                  })
                                }></Checkbox>
                              <Typography variant='subtitle2'>{childOption}</Typography>
                            </ListItem>
                          </Box>
                        </Box>
                      ))
                    : mainCause.children.map((subCause, subCauseIndex) => (
                        <Box
                          key={subCauseIndex}
                          variant='subtitle2'
                          sx={{ marginLeft: '1em', marginTop: '0.75em' }}>
                          <SubTitle2 variant='subtitle2'>{subCause.secondaryLabel}</SubTitle2>
                          {subCause.secondaryChildren.map(
                            (secondaryChildOption, secondaryChildIndex) => {
                              return (
                                <ListItem key={secondaryChildIndex}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        value={secondaryChildOption}
                                        checked={causesOfDeclineTypesChecked.includes(
                                          `${subCause.secondaryLabel}-${secondaryChildOption}`
                                        )}
                                        onChange={(event) =>
                                          handleCausesOfDeclineOnChange({
                                            event,
                                            mainCauseLabel: mainCause.label,
                                            subCauseLabel: subCause.secondaryLabel,
                                            secondaryChildOption
                                          })
                                        }></Checkbox>
                                    }
                                    label={<>{secondaryChildOption} </>}
                                  />
                                </ListItem>
                              )
                            }
                          )}
                        </Box>
                      ))}
                </Box>
              )
            })}
            <ErrorText>{errors.causesOfDecline?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
        {causesOfDeclineFields.length ? (
          <FormQuestionDiv>
            <StickyFormLabel>{causesOfDecline.levelsOfDegredation.question}</StickyFormLabel>
            {causesOfDeclineFields.map((mainCause, mainCauseIndex) => (
              <Box key={mainCauseIndex}>
                <SubTitle sx={{ marginBottom: '0.5em', marginTop: '1em' }}>
                  {mainCause.mainCauseLabel}
                </SubTitle>
                {mainCause.mainCauseAnswers?.map((answer, answerIndex) => {
                  return (
                    <Box key={answerIndex}>
                      <Typography sx={{ marginLeft: '0.75em' }} variant='subtitle2'>
                        {answer.mainCauseAnswer}
                      </Typography>
                      <Controller
                        name={`causesOfDecline.${mainCauseIndex}.mainCauseAnswers.${answerIndex}.levelOfDegredation`}
                        control={control}
                        defaultValue=''
                        required
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            required
                            value={field.value}
                            label='Magnitude of impact *'
                            sx={{
                              width: '13em',
                              marginLeft: '0.5em',
                              marginTop: '0.5em',
                              marginBottom: '1.5em'
                            }}>
                            {causesOfDecline.levelsOfDegredation.options.map((item, index) => (
                              <MenuItem key={index} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Box>
                  )
                })}
                {mainCause.subCauses?.map((subCause, subCauseIndex) => {
                  return (
                    <Box key={subCauseIndex}>
                      <SubTitle2 sx={{ marginLeft: '0.75em' }} variant='subtitle2'>
                        {subCause.subCauseLabel}
                      </SubTitle2>
                      {subCause.subCauseAnswers?.map((subCauseAnswer, subCauseAnswerIndex) => {
                        return (
                          <Box key={subCauseAnswerIndex}>
                            <Typography sx={{ marginLeft: '0.75em' }} variant='subtitle2'>
                              {subCauseAnswer.subCauseAnswer}
                            </Typography>
                            <Controller
                              name={`causesOfDecline.${mainCauseIndex}.subCauses.${subCauseIndex}.subCauseAnswers.${subCauseAnswerIndex}.levelOfDegredation`}
                              control={control}
                              defaultValue=''
                              required
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  select
                                  value={field.value}
                                  label='Magnitude of impact *'
                                  sx={{
                                    width: '13em',
                                    marginLeft: '0.5em',
                                    marginTop: '0.5em',
                                    marginBottom: '1em'
                                  }}>
                                  {causesOfDecline.levelsOfDegredation.options.map(
                                    (item, index) => (
                                      <MenuItem key={index} value={item}>
                                        {item}
                                      </MenuItem>
                                    )
                                  )}
                                </TextField>
                              )}
                            />
                          </Box>
                        )
                      })}
                    </Box>
                  )
                })}
              </Box>
            ))}
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          {isError && <ErrorText>Submit failed, please try again</ErrorText>}
          <ButtonSubmit isSubmitting={isSubmitting}></ButtonSubmit>
        </FormQuestionDiv>
      </Form>
    </ContentWrapper>
  )
}

export default CausesOfDeclineForm
