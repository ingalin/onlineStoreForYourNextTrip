// Insert data into new forms
//Check if fields are not empty
//Create new forms
//Create Total Amounts form
//Check for duplicates
// Calculate prices
// Calculate Total Amounts
// Add ADD, REEMOVE, DEELETE buttons
// Delete the wholee invoice if it's the last form


$(document).ready(function () {
    const $submit = $('.submitButton');
    const $invForms = $('.invoice');
    let idCounter = 0;
    const taxHST = 1.13;
    let totalPerItem = 0;
    let totalPerAllItems = 0;
    let pricePerItem = 0;
    let description = '';
    let enteredQuantity = 0;
    let currentTotal = 0;

    // Show or hide invoice
    $(".cart").on("click", function () {
        $(".itemList").addClass("hideFull");
        $(".invoiceSection").removeClass("hideFull");
        $(".cartText").html("Your Cart:");
    });

    $(".closeInvoice").on("click", function () {
        $(".itemList").removeClass("hideFull");
        $(".invoiceSection").addClass("hideFull");
        $(".cartText").html("Go To Your Cart:");
    });

    // Hide Popover
    function hidePopover(className) {
        setTimeout(function () {
            $(className).popover('hide');
        }, 1000);
    }

    $("input").focusin(function () {
        hidePopover(".startquantity");
    });

    //Function for calculating prices from given data (x should be THIS)
    function priceCalculation(x) {
        //Getting data from HTM file
        pricePerItem = (parseFloat($(x).closest('.descriptionQuantPrice').find(".price").text()));
        description = ($(x).closest('.descriptionQuantPrice').find(".description").text());
        totalPerItem = parseFloat((pricePerItem * enteredQuantity).toFixed(2));
        //Inserting data into new tables
        $invForms.prepend(`<div class="formatText">
            <div class="textPrices">
            <p class = "itemTable">${description}</p>
            <p class = "quantityTable">${enteredQuantity}</p>
            <p class = "priceTable">${pricePerItem}</p>
            <p class = "totalPrice">${totalPerItem}</p>
            </div>
            <button class = "removeButton styleButtons" id="remove${idCounter}" aria-label="remove one"><i class="fas fa-minus-circle" aria-hidden="true"></i></button>
            <button class = "addButton styleButtons" id="add${idCounter}" aria-label="add one"><i class="fas fa-plus-circle" aria-hidden="true"></i></button>
            <button class = "deleteButton styleButtons" id="delete${idCounter}" aria-label="delete item"><i class="fas fa-trash-alt"  aria-hidden="true"></i></button></div>`);
        //Calculating Total for all items
        totalPerAllItems = parseFloat($(`#totalPriceAllItems`).val());
        totalPerAllItems = parseFloat((totalPerAllItems + totalPerItem).toFixed(2));
        $(`#totalPriceAllItems`).val((totalPerAllItems).toFixed(2));
        $('#totalWithTax').val((totalPerAllItems * taxHST).toFixed(2));
        $('#tax').val(`${((taxHST - 1) * 100).toFixed(0)}%`);
        //ID counter to give each form element different ID
        idCounter = idCounter + 1;
    }

    //Show message that the item is inserted, hide submit button, hide quantity
    function changeButtonAndQuantityOnInsert(x) {
        $(x).find(".hideShowButton").popover('show');
        hidePopover(".hideShowButton");
        $(x).find(".hideShowButton").text("Item is in Cart").prop('disabled', true);
        // Hide quantity
        $(x).find(".startquantity").addClass("hide");
    }

    //Add the item to the Cart
    $submit.on('submit', function (event) {
        //Prevent default
        event.preventDefault();
        hidePopover(".startquantity");
        //Check if quantity field is not empty and if it's the first or second form to be inserted
        enteredQuantity = parseInt($(this).find('#startquantity').val());
        if (enteredQuantity >= 1) {
            if ($(`.totalAmounts`).length) {
                // It's the second form 
                // Update total quantity
                currentTotal = parseInt($(".countItems").text());
                currentTotal = currentTotal + enteredQuantity;
                $(".countItems").html(`${currentTotal}`);
                //Run function to insert values, calculate prices
                priceCalculation(this);
                //Run function to show message that the item is inserted and hide submit button
                changeButtonAndQuantityOnInsert(this);
            }
            // It's the first form
            else {
                enteredQuantity = parseInt($(this).find('#startquantity').val());
                // Update total quantity
                currentTotal = enteredQuantity;
                $(".countItems").html(`${currentTotal}`);
                //Append Total Amounts table
                $invForms.append(`<div class = "formatText totalAmountsAll">
                            <form class = "totalAmounts">
                                <label for="totalPriceAllItems">Total:</label>
                                <input readonly="readonly" type="text" id="totalPriceAllItems">
                                <label for="tax">HST:</label>
                                <input readonly="readonly" class="tax" type="text" id="tax">
                                <label for="totalWithTax" class="final">Total DUE:</label>
                                <input readonly="readonly" type="text" class="totalAmountDue" id="totalWithTax">
                            </form></div>`);
                //Run function to insert values, calculate prices
                priceCalculation(this);
                //Run function to show message that the item is inserted and hide submit button
                changeButtonAndQuantityOnInsert(this);
                //update Total Amounts values
                $(`#totalPriceAllItems`).val((totalPerItem).toFixed(2));
                $('#totalWithTax').val((totalPerItem * taxHST).toFixed(2));
            }
        }
        //If the quantity field is empty, show the error message
        else {
            // Quantity not valid, show message
            $(".hideShowButton").popover('hide');
            $(this).find(".startquantity").popover('show');
            hidePopover(".startquantity");
        }

        //ADD BUTTON
        $(`.addButton`).off("click").on('click', function (event) {
            event.preventDefault();
            // Update total count
            currentTotal = parseInt($(".countItems").text());
            currentTotal = currentTotal + 1;
            $(".countItems").html(`${currentTotal}`);
            //Get values for the fields
            enteredQuantity = parseInt($(this).closest(`div`).find(".quantityTable").text()) + 1;
            pricePerItem = parseFloat($(this).closest(`div`).find(".priceTable").text());
            totalPerItem = parseFloat(($(this).closest(`div`).find(".totalPrice").text()));
            totalPerItem = parseFloat((totalPerItem + pricePerItem).toFixed(2));
            //Insert new values
            $($(this).closest(`div`).find(".quantityTable")).text(enteredQuantity);
            $($(this).closest(`div`).find(".totalPrice")).text((totalPerItem).toFixed(2));
            //Update Total Amounts
            totalPerAllItems = parseFloat($(`#totalPriceAllItems`).val());
            totalPerAllItems = parseFloat((totalPerAllItems + pricePerItem).toFixed(2));
            $(`#totalPriceAllItems`).val((totalPerAllItems).toFixed(2));
            $('#totalWithTax').val((totalPerAllItems * taxHST).toFixed(2));
        });

        //REMOVE BUTTON
        $(`.removeButton`).off("click").on('click', function (event) {
            event.preventDefault();
            enteredQuantity = parseInt($(this).closest(`div`).find(".quantityTable").text()) - 1;
            //Check if it's the last item in a form
            if (enteredQuantity >= 1) {
                // Update total count
                currentTotal = parseInt($(".countItems").text());
                currentTotal = currentTotal - 1;
                $(".countItems").html(`${currentTotal}`);
                //Get values for the fields
                pricePerItem = parseFloat($(this).closest(`div`).find(".priceTable").text());
                totalPerItem = parseFloat(($(this).closest(`div`).find(".totalPrice").text()));
                totalPerItem = parseFloat((totalPerItem - pricePerItem).toFixed(2));
                //Insert new values
                $($(this).closest(`div`).find(".quantityTable")).text(enteredQuantity);
                $($(this).closest(`div`).find(".totalPrice")).text((totalPerItem).toFixed(2));
                //Update Total Amounts
                totalPerAllItems = parseFloat($(`#totalPriceAllItems`).val());
                totalPerAllItems = parseFloat((totalPerAllItems - pricePerItem).toFixed(2));
                $(`#totalPriceAllItems`).val((totalPerAllItems).toFixed(2));
                $('#totalWithTax').val((totalPerAllItems * taxHST).toFixed(2));
            }
            //If it is the last item, run function to delete the invoice
            else {
                removeInvoice(this);
            }
        })

        //DELETE BUTTON
        $($(`.deleteButton`)).off("click").on('click', function (event) {
            event.preventDefault();
            removeInvoice(this);
        });

        //Function to remove an invoice
        function removeInvoice(y) {
            description = ($(y).closest('.formatText').find(".itemTable").text());
            totalPerItem = parseFloat(($(y).closest(`div`).find(".totalPrice").text()));
            totalPerAllItems = parseFloat($(`#totalPriceAllItems`).val());
            totalPerAllItems = parseFloat((totalPerAllItems - totalPerItem).toFixed(2));
            enteredQuantity = parseInt($(y).closest(`div`).find(".quantityTable").text());
            currentTotal = parseInt($(".countItems").text());
            // Ask if the item needs to be deleted
            let myModal = new bootstrap.Modal(document.getElementById('myModal'));
            myModal.show();
            // if confirmed:
            $(".removeInvoiceConfirm").off("click").on("click", function () {
                myModal.hide();
                // Update total count
                currentTotal = currentTotal - enteredQuantity;
                $(".countItems").html(`${currentTotal}`);
                // If it's the last item, make the Add Item to Cart button active again
                let $eachItemSale = $(".description");
                for (let i = 0; i < $eachItemSale.length; i++) {
                    if ($($eachItemSale[i]).text() === description) {
                        $($eachItemSale[i]).closest(".descriptionQuantPrice").find(".hideShowButton").text("Add to Cart").prop('disabled', false);
                        $($eachItemSale[i]).closest(".descriptionQuantPrice").find(".startquantity").removeClass("hide");
                    }
                }
                //Delete item, update total prices:
                $(`#totalPriceAllItems`).val((totalPerAllItems).toFixed(2));
                $('#totalWithTax').val((totalPerAllItems * taxHST).toFixed(2));
                //Delete a form line
                $(y).closest(`div`).remove();
                //If it was the last line, delete also Total Amounts and a header
                if ($(`#totalPriceAllItems`).val() === "0.00") {
                    // Show modal
                    let myModalInvoiceDeleted = new bootstrap.Modal(document.getElementById('myModalInvoiceDeleted'));
                    myModalInvoiceDeleted.show();
                    $(`form`).remove(`.totalAmounts`);
                    $(`h2`).remove(`.itemList h2`);
                    $(".itemList").removeClass("hideFull");
                    $(".invoiceSection").addClass("hideFull");
                    $(".cartText").html("Go To Your Cart:");
                }
            });
        }
    });
});