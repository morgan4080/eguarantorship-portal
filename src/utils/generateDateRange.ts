const generateDateRange = (str: string)  => {
    let startDate: string
    let endDate: string
    const today = new Date()
    switch (str){
        case 'day':
            const dayAgo = new Date(today)
            dayAgo.setDate(dayAgo.getDate() - 1)
            startDate = dayAgo.toLocaleDateString('en-US')
            endDate = today.toLocaleDateString('en-US')
            return {
                startDate,
                endDate
            }
        case 'week':
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            startDate = weekAgo.toLocaleDateString('en-US')
            endDate = today.toLocaleDateString('en-US')
            return {
                startDate,
                endDate
            }
        case 'month':
            const monthAgo = new Date(today)
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            startDate = monthAgo.toLocaleDateString('en-US')
            endDate = today.toLocaleDateString('en-US')
            return {
                startDate,
                endDate
            }
        case 'year':
            const yearAgo = new Date(today)
            yearAgo.setFullYear(yearAgo.getFullYear() - 1)
            startDate = yearAgo.toLocaleDateString('en-US')
            endDate = today.toLocaleDateString('en-US')
            return {
                startDate,
                endDate
            }
        default:
            const yearDAgo = new Date(today)
            yearDAgo.setFullYear(yearDAgo.getFullYear() - 1)
            startDate = yearDAgo.toLocaleDateString('en-US')
            endDate = today.toLocaleDateString('en-US')
            return {
                startDate,
                endDate
            }
    }
}

export default generateDateRange