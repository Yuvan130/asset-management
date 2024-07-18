$(document).ready(function() {
    // Global AJAX setup
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Global error handling
    $(document).ajaxError(function(event, jqXHR, settings, thrownError) {
        console.error("AJAX error:", thrownError);
        alert("An error occurred. Please try again.");
    });

    // 1. Employees CRUD
    $('#addEmployeeFormClick').click(function(e) {
        e.preventDefault();
        console.log($('#addEmployeeForm').serialize())
        $.ajax({
            url: '/',
            method: 'POST',
            data: $('#addEmployeeForm').serialize(),
            success: function(response) {
                console.log(response)
                $('#addEmployeeModal').modal('hide');
                location.reload();
            }
        });
    });

    $('.edit-employee').click(function() {
        var id = $(this).data('id');
        // Fetch employee data and populate edit form
        $.get('/' + id, function(data) {
            $('#editEmployeeForm #id').val(data.id);
            $('#editEmployeeForm #name').val(data.name);
            $('#editEmployeeForm #email').val(data.email);
            $('#editEmployeeForm #isActive').prop('checked', data.isActive);
            $('#editEmployeeModal').modal('show');
        });
    });

    $('#editEmployeeForm').submit(function(e) {
        e.preventDefault();
        var id = $('#editEmployeeForm #id').val();
        $.ajax({
            url: '/' + id,
            method: 'PUT',
            data: $(this).serialize(),
            success: function(response) {
                $('#editEmployeeModal').modal('hide');
                location.reload();
            }
        });
    });

    $('.delete-employee').click(function() {
        if (confirm('Are you sure you want to delete this employee?')) {
            var id = $(this).data('id');
            $.ajax({
                url: '/' + id,
                method: 'DELETE',
                success: function(response) {
                    location.reload();
                }
            });
        }
    });

    // 2. Assets CRUD
    $('#addAssetForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/assets',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                $('#addAssetModal').modal('hide');
                location.reload();
            }
        });
    });

    $('.edit-asset').click(function() {
        var id = $(this).data('id');
        $.get('/assets/' + id, function(data) {
            $('#editAssetForm #id').val(data.id);
            $('#editAssetForm #serialNumber').val(data.serialNumber);
            $('#editAssetForm #make').val(data.make);
            $('#editAssetForm #model').val(data.model);
            $('#editAssetForm #category').val(data.asset_category_id);
            $('#editAssetForm #value').val(data.value);
            $('#editAssetModal').modal('show');
        });
    });

    $('#editAssetForm').submit(function(e) {
        e.preventDefault();
        var id = $('#editAssetForm #id').val();
        $.ajax({
            url: '/assets/' + id,
            method: 'PUT',
            data: $(this).serialize(),
            success: function(response) {
                $('#editAssetModal').modal('hide');
                location.reload();
            }
        });
    });

    $('.delete-asset').click(function() {
        if (confirm('Are you sure you want to delete this asset?')) {
            var id = $(this).data('id');
            $.ajax({
                url: '/assets/' + id,
                method: 'DELETE',
                success: function(response) {
                    location.reload();
                }
            });
        }
    });

    // 3. Asset Categories CRUD
    $('#addCategoryForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/asset-categories',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                $('#addCategoryModal').modal('hide');
                location.reload();
            }
        });
    });

    $('.edit-category').click(function() {
        var id = $(this).data('id');
        $.get('/asset-categories/' + id, function(data) {
            $('#editCategoryForm #id').val(data.id);
            $('#editCategoryForm #name').val(data.name);
            $('#editCategoryModal').modal('show');
        });
    });

    $('#editCategoryForm').submit(function(e) {
        e.preventDefault();
        var id = $('#editCategoryForm #id').val();
        $.ajax({
            url: '/asset-categories/' + id,
            method: 'PUT',
            data: $(this).serialize(),
            success: function(response) {
                $('#editCategoryModal').modal('hide');
                location.reload();
            }
        });
    });

    $('.delete-category').click(function() {
        if (confirm('Are you sure you want to delete this category?')) {
            var id = $(this).data('id');
            $.ajax({
                url: '/asset-categories/' + id,
                method: 'DELETE',
                success: function(response) {
                    location.reload();
                }
            });
        }
    });

    // 4. Issue Asset
    $('#issueAssetForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/issue',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                alert('Asset issued successfully');
                location.href = '/assets';
            }
        });
    });

    // 5. Return Asset
    $('#returnAssetForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/return',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                alert('Asset returned successfully');
                location.href = '/assets';
            }
        });
    });

    // 6. Scrap Asset
    $('#scrapAssetForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/scrap',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                alert('Asset scrapped successfully');
                location.href = '/assets';
            }
        });
    });

    // 7. Asset History
    // This is typically handled server-side and displayed in a table
    // You can add client-side filtering or sorting if needed
    if ($('#historyTable').length) {
        $('#historyTable').DataTable({
            "order": [[ 0, "desc" ]]
        });
    }

    // 8. Stock View
    // This is typically handled server-side and displayed in a table
    // You can add client-side filtering or sorting if needed
    if ($('#stockTable').length) {
        $('#stockTable').DataTable({
            "footerCallback": function(row, data, start, end, display) {
                var api = this.api();
                var totalCount = api.column(1).data().reduce((a, b) => parseInt(a) + parseInt(b), 0);
                var totalValue = api.column(2).data().reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
                $(api.column(1).footer()).html(totalCount);
                $(api.column(2).footer()).html(totalValue.toFixed(2));
            }
        });
    }
});