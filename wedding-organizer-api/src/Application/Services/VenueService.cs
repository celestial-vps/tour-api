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
    public class VenueService : IVenueService
    {
        private readonly IVenueRepository _venueRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public VenueService(
            IVenueRepository venueRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _venueRepository = venueRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? venue, ApiError? err)> CreateAsync(CreateVenueDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new Venue
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

                var (result, err) = await _venueRepository.SaveAsync(entity);
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

        public async Task<(MessageVM? venue, ApiError? err)> UpdateAsync(Guid oid, UpdateVenueDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingVenue, findErr) = await _venueRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingVenue == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Venue not found"));
                }

                // Update only if DTO fields are not null
                existingVenue.Name = dto.Name ?? existingVenue.Name;
                existingVenue.Location = dto.Location ?? existingVenue.Location;
                // existingVenue.Capacity = dto.Capacity ?? existingVenue.Capacity;
                // existingVenue.Price = dto.Price ?? existingVenue.Price;
                existingVenue.Contact = dto.Contact ?? existingVenue.Contact;
                existingVenue.LastModifiedBy = userOid;
                existingVenue.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _venueRepository.UpdateAsync(oid, existingVenue);
                if (updateErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(updateErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = _mapper.Map<MessageVM>(updatedResult);
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? venue, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (venue, findErr) = await _venueRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (venue == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Venue not found"));
                }

                var (deleted, removeErr) = await _venueRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = _mapper.Map<MessageVM>(venue);
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<VenueVM> venues, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _venueRepository.FindAllAsync();
                if (err != null)
                    return (new List<VenueVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<VenueVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<VenueVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(VenueVM? venue, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _venueRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("Venue not found"));

                var response = _mapper.Map<VenueVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        // Task<(VenueVM? venue, ApiError? err)> IVenueService.FindByIdAsync(Guid oid)
        // {
        //     throw new NotImplementedException();
        // }

        // public async Task<(List<VenueVM> venues, ApiError? err)> FindAllAsync()
        // {
        //     try
        //     {
        //         var (result, err) = await _venueRepository.FindAllAsync();
        //         if (err != null)
        //             return (new List<VenueVM>(), ApiError.InternalServerError(err));

        //         var responses = _mapper.Map<List<VenueVM>>(result);
        //         return (responses, null);
        //     }
        //     catch (Exception ex)
        //     {
        //         return (new List<VenueVM>(), ApiError.InternalServerError(ex));
        //     }
        // }

    }
}
