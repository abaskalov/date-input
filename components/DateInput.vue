<template>
  <input v-model="valueInternal" type="text" :placeholder="placeholder">
</template>

<script lang="ts" setup>
import { shallowRef, watch, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

/*
 * Input component for dates in range between 1900-01-01 and 2199-12-31
 */

// extend dayjs with customParseFormat
dayjs.extend(customParseFormat);

const isEnUsLocale = shallowRef<boolean>(false);

// placeholder for the input
const placeholder = shallowRef<'MM/DD/YYYY' | 'DD/MM/YYYY' | null>(null);

// external date format and value
const dateFormatExternal = 'YYYY-MM-DD';
const valueExternal = defineModel<string>({ required: true });

// internal date format and value
const dateFormatInternal = computed<'MM/DD/YYYY' | 'DD/MM/YYYY'>(() => isEnUsLocale.value ? 'MM/DD/YYYY' : 'DD/MM/YYYY');
const valueInternal = shallowRef<string>('');


// initially check if the external value is valid date
if (!dayjs(valueExternal.value, dateFormatExternal, true).isValid()) valueExternal.value = '';

// watch for changes in value bind to the input
watch(
  () => valueInternal.value,
  (newValue) => {
    // if length is greater than 10, slice it to 10
    if (newValue.length > 10) {
      newValue = newValue.slice(0, 10);
    }

    // remove all non-numeric characters except for slashes
    valueInternal.value = newValue.replace(/[^\d/]/g, '');

    // split the string into an array of characters
    const inputArray = valueInternal.value.split('');

    // add slashes at the correct positions
    [2, 5].forEach((slashIndex) => {
      if (inputArray[slashIndex] !== undefined && inputArray[slashIndex] !== '/') {
        inputArray.splice(slashIndex, 0, '/');
      }
    });

    // check if day is valid
    const dayStartIndex = isEnUsLocale.value ? 3 : 0;
    if (parseInt(inputArray[dayStartIndex]) > 3) inputArray[dayStartIndex] = ''
    const dayParsed = parseInt(inputArray[dayStartIndex] + inputArray[dayStartIndex + 1])
    if (dayParsed > 31 || dayParsed <= 0) inputArray[dayStartIndex + 1] = ''

    // check if month is valid
    const monthStartIndex = isEnUsLocale.value ? 0 : 3;
    if (parseInt(inputArray[monthStartIndex]) > 1) inputArray[monthStartIndex] = ''
    const monthParsed = parseInt(inputArray[monthStartIndex] + inputArray[monthStartIndex + 1])
    if (monthParsed > 12 || monthParsed <= 0) inputArray[monthStartIndex + 1] = ''

    // check if year is valid by checking if the year is less than 2199
    if (parseInt(inputArray[6]) > 2) inputArray[6] = ''
    if (parseInt(inputArray[6] + inputArray[7]) > 21) inputArray[7] = ''

    // check if year is valid by checking if the year is greater than 1900
    if (parseInt(inputArray[6]) < 1) inputArray[6] = ''
    if (parseInt(inputArray[6] + inputArray[7]) < 19) inputArray[7] = ''


    // check if the date is valid and prevent the user from entering a date that is not valid
    if (inputArray.length === 10) {
      const dateObject = dayjs(inputArray.join(''), dateFormatInternal.value, true);
      if (!dateObject.isValid()) inputArray[9] = ''
    }

    // join the array back into a string
    valueInternal.value = inputArray.join('');

    // parse the date and check if it is valid
    const dateObject = dayjs(valueInternal.value, dateFormatInternal.value, true);
    valueExternal.value = dateObject.isValid() ? dateObject.format(dateFormatExternal) : '';
  },
);

const init = () => {
  // Set min and max dates for initial value validation
  const minDate = dayjs('1900-01-01');
  const maxDate = dayjs('2199-12-31');

  // check if the user's locale is en-US
  isEnUsLocale.value = navigator?.language === 'en-US';

  // format initial date to the correct format if it is valid and in range otherwise set it to empty string
  const dateObject = dayjs(valueExternal.value, dateFormatExternal, true);
  valueInternal.value = dateObject.isValid() && dateObject.isAfter(minDate.subtract(1, 'day')) && dateObject.isBefore(maxDate.add(1, 'day')) ? dateObject.format(dateFormatInternal.value) : '';
}

init();

onMounted(() => {
  // set the placeholder based on the user's locale
  placeholder.value = dateFormatInternal.value;
});
</script>
