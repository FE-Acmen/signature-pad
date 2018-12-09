(function() {
    var modalBox = {};
    //modalBox.pad = document.getElementById("signature");
    modalBox.modal = document.getElementById("myModal");
    modalBox.triggerBtn = document.getElementById("triggerBtn");
    modalBox.closeBtn = document.getElementById("closeBtn");
    modalBox.modal.style.display = "none";
    modalBox.show = function() {
        console.log(this.modal);
        this.modal.style.display = "block";
        //this.pad.style.display = "none";
    }
    
    modalBox.close = function() {
        this.modal.style.display = "none";
        //this.pad.style.display = "block";
    }
    
    modalBox.outsideClick = function() {
        var modal = this.modal;
        var pad = this.pad;
        window.onclick = function(event) {
            if(event.target == modal) {
                modal.style.display = "none";
                //pad.style.display = "block";
            }
        }
    }
    
    modalBox.init = function() {
        var that = this;
        this.triggerBtn.onclick = function() {
            that.show();
        }
        this.closeBtn.onclick = function() {
            that.close();
        }
        this.outsideClick();
    }
    modalBox.init();
 
})();