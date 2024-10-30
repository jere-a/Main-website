export const dynImport = {
    global: {
        capitalize: (await import('@/ts/global')).capitalize,
        query: (await import('@/ts/global')).query,
        isHoliday: (await import('@/ts/global')).isHoliday,
        holidayTimeTo: (await import('@/ts/global')).holidayTimeTo
    }
}