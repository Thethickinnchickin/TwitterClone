$("#postTextarea").keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();
    
    var submitButton = $("#submitPostButton");

    if(submitButton.length == 0) alert("Submit button not found");

    if(value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
});

$("#submitPostButton").click(() => {
    var button = $(event.target);
    var textbox = $("#postTextarea");

    var data = {
        content: textbox.val()
    }

    $.post("/api/posts", data, (postData) => {
        var html = createPostHtml(postData);
        $('.postsContainer').prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
});

function createPostHtml(postData) {
    var postedBy = postData.postedBy;
    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    var likeButtonActiveClass = postData.likedBy.includes(userLoggedIn._id) ? "active" : "";

    return `<div class='post' data-id='${postData._id}'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>

                            
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <div>${postData.content}</div>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='fas fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button class='retweet'>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class='fas fa-heart'></i>
                                    <span>${postData.likedBy.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
        
    var elapsed = current - previous;
        
    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just Now";
            return Math.round(elapsed/1000) + ' seconds ago';   
    }
        
    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }
        
    else if (elapsed < msPerDay ) {
        if(Math.round(elapsed/msPerHour) == 1) {
            return Math.round(elapsed/msPerHour ) + ' hour ago';
        } 
        return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }
        
    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }
        
    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }
        
    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

$(document).on("click", ".likeButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if(postId == undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {
            button.find("span").text(postData.likedBy.length || "")

            if(postData.likedBy.includes(userLoggedIn._id)) {
                button.addClass("active");
            } else {
                button.removeClass("active");
            }
        }
    })
})

function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    var rootElement = isRoot == true ? element : element.closest(".post");
    var postId = rootElement.data().id;

    if(postId == undefined) {
        return console.log("User object not populated");
    }

    return postId;
}