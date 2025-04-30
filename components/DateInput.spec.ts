import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import DateInput from './DateInput.vue'

describe('DateInput', () => {
    it('formats input correctly for en-US locale with initial value', async () => {
        Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '2024-12-31',
            },
        })
        const input = wrapper.find('input');
        expect(input.element.value).toBe('12/31/2024');
    })

    it('formats input correctly for other locales with initial value', async () => {
        Object.defineProperty(navigator, 'language', { value: 'kk-KZ', configurable: true });
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '2024-12-31',
            },
        });
        const input = wrapper.find('input');
        expect(input.element.value).toBe('31/12/2024');
    })

    it('handle wrong initial value', async () => {
        const wrapper = mount(DateInput, {
            props: {
                modelValue: 'gdfgdfgfdgff',
            },
        });
        const input = wrapper.find('input');
        expect(input.element.value).toBe('');
    })

    it('formats input correctly for en-US locale', async () => {
        Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '',
            },
        })
        const input = wrapper.find('input');
        await input.setValue('12/31/2024');
        expect(input.element.value).toBe('12/31/2024');
    })

    it('formats input correctly for other locales', async () => {
        Object.defineProperty(navigator, 'language', { value: 'kk-KZ', configurable: true });
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '',
            },
        })
        const input = wrapper.find('input');
        await input.setValue('31/12/2024');
        expect(input.element.value).toBe('31/12/2024');
    })

    it('check for leap year valid', async () => {
        Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '',
            },
        })
        const input = wrapper.find('input');
        await input.setValue('02/29/1996');
        expect(input.element.value).toBe('02/29/1996');
    })

    it('check for leap year invalid', async () => {
        Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
        const wrapper = mount(DateInput, {
            props: {
                modelValue: '',
            },
        })
        const input = wrapper.find('input');
        await input.setValue('02/29/1997');
        expect(input.element.value).toBe('02/29/199');
    })
})
