// Test in axios instances

import { describe, expect, test } from 'vitest'
import { giphyApi } from './giphy.api';

describe('giphyApi', () => {
    test('should be configured correctly', () => {
        // console.log(giphyApi.defaults)
        const params = giphyApi.defaults.params;
        // console.log(params);
        expect(giphyApi.defaults.baseURL).toBe('https://api.giphy.com/v1/gifs')

        //toBe for primitives
        expect(params.lang).toBe('es');
        expect(params.api_key).toBe(import.meta.env.VITE_GIPHY_API_KEY)

        //toStrictEqual for objects
        expect(params).toStrictEqual({
            lang: 'es',
            api_key: import.meta.env.VITE_GIPHY_API_KEY,
        });
    });
});

