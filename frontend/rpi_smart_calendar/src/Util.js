/* Contains a list of utilities that are shared by all the codes */

// ISO 8601 weeek
export function getWeek(date) { 
  var target  = new Date(date.valueOf());  

  // ISO week date weeks start on monday, so correct the day number  
  var dayNr   = (target.getDay() + 6) % 7;  

  // Set the target to the thursday of this week so the  
  // target date is in the right year  
  target.setDate(target.getDate() - dayNr + 3);  

  // ISO 8601 states that week 1 is the week with january 4th in it  
  var jan4    = new Date(target.getFullYear(), 0, 4);  

  // Number of days between target date and january 4th  
  var dayDiff = (target - jan4) / 86400000;    

  if(new Date(target.getFullYear(), 0, 1).getDay() < 5) {
    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between target date and january 4th    
    return 1 + Math.ceil(dayDiff / 7);    
  }
  else {  // jan 4th is on the next week (so next week is week 1)
    return Math.ceil(dayDiff / 7); 
  }
}; 

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
