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
    public class FoodPackageService : IFoodPackageService
    {
        private readonly IFoodPackageRepository _foodPackageRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public FoodPackageService(
            IFoodPackageRepository foodPackageRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _foodPackageRepository = foodPackageRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? foodPackage, ApiError? err)> CreateAsync(CreateFoodPackageDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new FoodPackage
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

                var (result, err) = await _foodPackageRepository.SaveAsync(entity);
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

        public async Task<(MessageVM? foodPackage, ApiError? err)> UpdateAsync(Guid oid, UpdateFoodPackageDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingFoodPackage, findErr) = await _foodPackageRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingFoodPackage == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("FoodPackage not found"));
                }

                // Update only if DTO fields are not null
                existingFoodPackage.Name = dto.Name ?? existingFoodPackage.Name;
                existingFoodPackage.Location = dto.Location ?? existingFoodPackage.Location;
                // existingFoodPackage.Capacity = dto.Capacity ?? existingFoodPackage.Capacity;
                // existingFoodPackage.Price = dto.Price ?? existingFoodPackage.Price;
                existingFoodPackage.Contact = dto.Contact ?? existingFoodPackage.Contact;
                existingFoodPackage.LastModifiedBy = userOid;
                existingFoodPackage.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _foodPackageRepository.UpdateAsync(oid, existingFoodPackage);
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

        public async Task<(MessageVM? foodPackage, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (foodPackage, findErr) = await _foodPackageRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (foodPackage == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("FoodPackage not found"));
                }

                var (deleted, removeErr) = await _foodPackageRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = foodPackage.Oid.ToString(),
                    Name = foodPackage.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<FoodPackageVM> foodPackages, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _foodPackageRepository.FindAllAsync();
                if (err != null)
                    return (new List<FoodPackageVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<FoodPackageVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<FoodPackageVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(FoodPackageVM? foodPackage, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _foodPackageRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("FoodPackage not found"));

                var response = _mapper.Map<FoodPackageVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<FoodPackageVM> foodPackages, ApiError? err)> FindPageAsync(FoodPackageFilterDto dto, int page, int pageSize)
        {
            try
            {
                var (result, total, err) = await _foodPackageRepository.FindByCriteriaPageAsync( page, pageSize,dto);
                if (err != null)
                    return (new List<FoodPackageVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<FoodPackageVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<FoodPackageVM>(), ApiError.InternalServerError(ex));
            }
        } 

    }
}
