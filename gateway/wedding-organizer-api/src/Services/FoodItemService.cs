using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Mappings;
using Microsoft.EntityFrameworkCore.Storage;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;
using WeddingOrganizerAPI.Models;
using WeddingOrganizerAPI.Repositories;
using WeddingOrganizerAPI.Services.Interfaces;

namespace WeddingOrganizerAPI.Services
{
    public class FoodItemService : IFoodItemService
    {
        private readonly IFoodItemRepository _foodItemRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public FoodItemService(
            IFoodItemRepository foodItemRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _foodItemRepository = foodItemRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? foodItem, ApiError? err)> CreateAsync(CreateFoodItemDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new FoodItem
                {
                    Name = dto.Name,
                    Location = dto.Location,
                    Capacity = dto.Capacity,
                    Price = dto.Price,
                    Contact = dto.Contact,
                    CreatedBy = userOid,
                    CreatedAt = now,
                    LastModifiedBy = userOid,
                    UpdatedAt = now,
                };

                var (result, err) = await _foodItemRepository.SaveAsync(entity);
                if (err != null || result == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(err));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                // var response = _mapper.Map<MessageVM>(result);
                var response = new MessageVM
                {
                    Value = result.Oid.ToString(),
                    Name = result.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? foodItem, ApiError? err)> UpdateAsync(Guid oid, UpdateFoodItemDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingFoodItem, findErr) = await _foodItemRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingFoodItem == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("FoodItem not found"));
                }

                // Update only if DTO fields are not null
                existingFoodItem.Name = dto.Name ?? existingFoodItem.Name;
                existingFoodItem.Location = dto.Location ?? existingFoodItem.Location;
                // existingFoodItem.Capacity = dto.Capacity ?? existingFoodItem.Capacity;
                // existingFoodItem.Price = dto.Price ?? existingFoodItem.Price;
                existingFoodItem.Contact = dto.Contact ?? existingFoodItem.Contact;
                existingFoodItem.LastModifiedBy = userOid;
                existingFoodItem.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _foodItemRepository.UpdateAsync(oid, existingFoodItem);
                if (updateErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(updateErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = updatedResult.Oid.ToString(),
                    Name = updatedResult.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? foodItem, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (foodItem, findErr) = await _foodItemRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (foodItem == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("FoodItem not found"));
                }

                var (deleted, removeErr) = await _foodItemRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = foodItem.Oid.ToString(),
                    Name = foodItem.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<FoodItemVM> foodItems, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _foodItemRepository.FindAllAsync();
                if (err != null)
                    return (new List<FoodItemVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<FoodItemVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<FoodItemVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(FoodItemVM? foodItem, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _foodItemRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("FoodItem not found"));

                var response = _mapper.Map<FoodItemVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<FoodItemVM> foodItems, ApiError? err)> FindPageAsync(FoodItemFilterDto dto, int page, int pageSize)
        {
            try
            {
                var (result, total, err) = await _foodItemRepository.FindByCriteriaPageAsync( page, pageSize,dto);
                if (err != null)
                    return (new List<FoodItemVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<FoodItemVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<FoodItemVM>(), ApiError.InternalServerError(ex));
            }
        }
 

    }
}
