const timeHelpers = {
    timeAgo: function timeAgo(date) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
      
        const thresholds = [
          { threshold: 540 * day, modifier: 365 * day, render: elapsed => `${elapsed} years ago` },
          { threshold: 320 * day, render: () => "a year ago" },
          { threshold: 45 * day, modifier: 30 * day, render: elapsed => `${elapsed} months ago` },
          { threshold: 26 * day, render: () => "a month ago" },
          { threshold: 36 * hour, modifier: 24 * hour, render: elapsed => `${elapsed} days ago` },
          { threshold: 22 * hour, render: () => "a day ago" },
          { threshold: 90 * minute, modifier: 60 * minute, render: elapsed => `${elapsed} hrs ago` },
          { threshold: 45 * minute, render: () => "an hour ago" },
          { threshold: 90 * second, modifier: 60 * second, render: elapsed => `${elapsed} mins ago` },
          { threshold: 0 * second, render: () => "a min ago" },
          //{ threshold: 0 * second, render: () => "a few secs ago" }
        ];
      
        const internalDate = new Date(date)
        const elapsed = Math.round(new Date() - internalDate);
        const { render, modifier } = thresholds.find(({ threshold }) => elapsed >= threshold);
        return render(Math.round(elapsed / modifier));
      }
}


export default timeHelpers;
